import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
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
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getCurrentUser, type AccountUser } from "@/lib/api";

const links = [
  { to: "/", label: "Quizzes", icon: Home },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/history", label: "My progress", icon: History },
  { to: "/certificate", label: "Verify", icon: BadgeCheck },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AccountUser | null>(null);

  useEffect(() => {
    let alive = true;
    void getCurrentUser()
      .then(({ user }) => {
        if (alive) setUser(user);
      })
      .catch(() => {
        if (alive) setUser(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/70 print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
        >
          <img
            src="/logo.png"
            alt="Quitech logo"
            className="h-9 w-9 rounded-md object-cover shadow-sm ring-1 ring-border"
          />
          <span>Quitech</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
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
              <a
                href="/auth?next=/wallet"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </a>
              <a
                href="/auth?mode=signup&next=/wallet"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <UserPlus className="h-4 w-4" />
                Create account
              </a>
            </div>
          )}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
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

      {open && (
        <nav
          className="border-t border-border bg-background px-4 py-2 md:hidden"
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
              <a
                href="/auth?next=/wallet"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </a>
              <a
                href="/auth?mode=signup&next=/wallet"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <UserPlus className="h-4 w-4" />
                Create account
              </a>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
