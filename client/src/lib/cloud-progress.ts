import { supabase } from "@/integrations/supabase/client";
import { loadProgress, saveProgress, clearProgress, type SavedProgress } from "@/lib/attempt-store";

export interface RemoteProgress extends SavedProgress {
  version: number;
  deviceLabel: string | null;
}

function deviceLabel(): string {
  if (typeof navigator === "undefined") return "This device";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|Android/i.test(ua)) return "Mobile device";
  if (/Mac/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows PC";
  return "This device";
}

/** Read this user's cloud-saved progress for a section, if any. */
export async function fetchRemoteProgress(quizId: string): Promise<RemoteProgress | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase
    .from("quiz_progress")
    .select("*")
    .eq("user_id", auth.user.id)
    .eq("quiz_id", quizId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    quizId: data.quiz_id,
    mode: data.mode === "full" ? "full" : Number(data.mode),
    seed: data.seed ?? "",
    answers: (data.answers ?? {}) as Record<string, number>,
    flagged: (data.flagged ?? []) as string[],
    currentIndex: data.current_index,
    elapsedSeconds: data.elapsed_seconds,
    savedAt: data.updated_at,
    version: data.version,
    deviceLabel: data.device_label,
  };
}

/**
 * Conflict-safe write: only persists when our version is at least the stored
 * one, so a stale tab can never clobber newer progress from another device.
 */
export async function pushProgress(progress: SavedProgress, knownVersion: number): Promise<number> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return knownVersion;

  const { data: existing } = await supabase
    .from("quiz_progress")
    .select("version")
    .eq("user_id", auth.user.id)
    .eq("quiz_id", progress.quizId)
    .maybeSingle();

  const remoteVersion = existing?.version ?? 0;
  if (remoteVersion > knownVersion) return remoteVersion; // someone else is ahead — don't overwrite

  const nextVersion = Math.max(remoteVersion, knownVersion) + 1;
  const { error } = await supabase.from("quiz_progress").upsert(
    {
      user_id: auth.user.id,
      quiz_id: progress.quizId,
      mode: String(progress.mode),
      seed: progress.seed,
      answers: progress.answers,
      flagged: progress.flagged,
      current_index: progress.currentIndex,
      elapsed_seconds: progress.elapsedSeconds,
      version: nextVersion,
      device_label: deviceLabel(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,quiz_id" },
  );
  if (error) return knownVersion;
  return nextVersion;
}

export async function dropRemoteProgress(quizId: string): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  clearProgress(quizId);
  if (!auth.user) return;
  await supabase.from("quiz_progress").delete().eq("user_id", auth.user.id).eq("quiz_id", quizId);
}

export interface ResumeChoice {
  local: SavedProgress | null;
  remote: RemoteProgress | null;
  /** Whichever save is furthest along. */
  best: (SavedProgress & { version?: number }) | null;
  conflict: boolean;
}

/** Decide which save to resume from. More answers wins; ties go to the newer save. */
export async function resolveResume(quizId: string): Promise<ResumeChoice> {
  const local = loadProgress(quizId);
  const remote = await fetchRemoteProgress(quizId);
  if (!local && !remote) return { local, remote, best: null, conflict: false };
  if (!remote) return { local, remote, best: local, conflict: false };
  if (!local) {
    saveProgress(remote);
    return { local, remote, best: remote, conflict: false };
  }
  const localCount = Object.keys(local.answers).length;
  const remoteCount = Object.keys(remote.answers).length;
  const remoteWins =
    remoteCount > localCount || (remoteCount === localCount && remote.savedAt > local.savedAt);
  const best = remoteWins ? remote : local;
  if (remoteWins) saveProgress(remote);
  return { local, remote, best, conflict: localCount !== remoteCount };
}
