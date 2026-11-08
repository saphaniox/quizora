import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  BookOpen,
  BookOpenCheck,
  Award,
  GraduationCap,
  CalendarDays,
  History,
  Home,
  LogIn,
  Menu,
  ShieldCheck,
  Trophy,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getCurrentUser } from "@/lib/api";
import { notifications } from "@/lib/notifications";
import { Capacitor } from "@capacitor/core";
import {
  dismissGuestPushPrompt,
  enablePushNotifications,
  getGuestPushNotificationsEnabled,
  hasDismissedGuestPushPrompt,
  setGuestPushNotificationsEnabled,
  setNativeBannerSuppressed,
  syncGuestPushNotifications,
  syncPushNotifications,
} from "@/lib/native-services";

const links = [
  { to: "/learn", label: "Learn", icon: GraduationCap },
  { to: "/", label: "Quizzes", icon: Home },
  { to: "/daily-challenge", label: "Daily challenge", icon: CalendarDays },
  { to: "/study-guides", label: "Study guides", icon: BookOpen },
  { to: "/revision-notes", label: "Revision notes", icon: BookOpenCheck },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/history", label: "My progress", icon: History },
  { to: "/certificate-samples", label: "Samples", icon: Award },
  { to: "/certificate", label: "Verify", icon: BadgeCheck },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [showGuestPushPrompt, setShowGuestPushPrompt] = useState(false);
  const [enablingGuestPush, setEnablingGuestPush] = useState(false);
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { data, isLoading: isLoadingUser } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => getCurrentUser(),
    retry: false,
  });
  const user = data?.user ?? null;
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      void syncPushNotifications();
    } else if (!isLoadingUser) {
      void syncGuestPushNotifications();
    }
  }, [isLoadingUser, userId]);

  useEffect(() => {
    if (
      !Capacitor.isNativePlatform() ||
      isLoadingUser ||
      userId ||
      getGuestPushNotificationsEnabled() ||
      hasDismissedGuestPushPrompt()
    ) {
      return;
    }
    const timer = window.setTimeout(() => setShowGuestPushPrompt(true), 2500);
    return () => window.clearTimeout(timer);
  }, [isLoadingUser, userId]);

  const enableGuestPush = async () => {
    if (enablingGuestPush) return;
    setEnablingGuestPush(true);
    try {
      const granted = await enablePushNotifications(true);
      if (!granted) {
        notifications.info("Notifications are still turned off", {
          description:
            "You can allow Quitech notifications in your device settings, then enable them from Privacy settings.",
        });
        return;
      }
      await setGuestPushNotificationsEnabled(true);
      dismissGuestPushPrompt();
      setShowGuestPushPrompt(false);
      notifications.success("You’re subscribed to Quitech updates", {
        description: "You can change this anytime in Privacy settings.",
      });
    } catch (error) {
      notifications.error("We couldn’t enable notifications", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setEnablingGuestPush(false);
    }
  };

  const dismissGuestPush = () => {
    dismissGuestPushPrompt();
    setShowGuestPushPrompt(false);
  };

  useEffect(() => {
    void setNativeBannerSuppressed(open);
    document.documentElement.dataset["mobileNavigationOpen"] = String(open);
    window.dispatchEvent(new CustomEvent("quitech:mobile-navigation", { detail: open }));
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/70 print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
          >
            <img
              src="/logo.png"
              alt="Quitech logo"
              className="h-9 w-9 rounded-md object-cover shadow-sm ring-1 ring-border"
            />
            <span className="truncate">Quitech</span>
          </Link>

          <nav className="hidden items-center gap-1 2xl:flex" aria-label="Main">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent" }}
                activeOptions={{ exact: to === "/" }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}
            {user ? (
              <Link
                to="/wallet"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <UserRound className="h-4 w-4" />
                Account
              </Link>
            ) : (
              <div className="ml-2 flex items-center gap-2">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "signup" }}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <UserPlus className="h-4 w-4" />
                  Create account
                </Link>
              </div>
            )}
            <ThemeToggle />
          </nav>

          <div className="flex items-center gap-1 2xl:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {pathname !== "/" && (
          <div className="mx-auto max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
            <button
              type="button"
              aria-label="Go back"
              title="Go back"
              onClick={() => {
                if (router.history.canGoBack()) router.history.back();
                else void router.navigate({ to: "/" });
              }}
              className="inline-flex h-8 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        )}

        {open && (
          <nav
            className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-background px-4 py-2 2xl:hidden"
            aria-label="Mobile"
          >
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent" }}
                activeOptions={{ exact: to === "/" }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}
            {user ? (
              <Link
                to="/wallet"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                <UserRound className="h-4 w-4" />
                Account
              </Link>
            ) : (
              <div className="mt-2 grid gap-2 border-t border-border pt-2">
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "signup" }}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <UserPlus className="h-4 w-4" />
                  Create account
                </Link>
              </div>
            )}
          </nav>
        )}
      </header>
      {showGuestPushPrompt && (
        <aside
          aria-label="Quitech notifications"
          className="border-b border-primary/20 bg-primary/5 px-4 py-4 print:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Stay in the loop with Quitech
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get occasional greetings, learning news, and important app updates. No account is
                  needed, and you can turn notifications off anytime.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 pl-8 sm:pl-0">
              <button
                type="button"
                onClick={() => void enableGuestPush()}
                disabled={enablingGuestPush}
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {enablingGuestPush ? "Enabling…" : "Enable notifications"}
              </button>
              <button
                type="button"
                onClick={dismissGuestPush}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-accent"
              >
                Not now
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
