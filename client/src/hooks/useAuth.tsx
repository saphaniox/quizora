import { useEffect, useState } from "react";
import { getCurrentUser, type AccountUser } from "@/lib/api";

export interface AuthState {
  session: AccountUser | null;
  user: AccountUser | null;
  loading: boolean;
}

/** Lightweight session subscriber. The root route owns cache invalidation. */
export function useAuth(): AuthState {
  const [session, setSession] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getCurrentUser().then(({ user }) => {
      if (!active) return;
      setSession(user);
      setLoading(false);
    }).catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { session, user: session, loading };
}

export function useIsAdmin(userId: string | undefined): { isAdmin: boolean; checking: boolean } {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    setChecking(true);
    setIsAdmin(false);
    setChecking(false);
    return () => {
      active = false;
    };
  }, [userId]);

  return { isAdmin, checking };
}
