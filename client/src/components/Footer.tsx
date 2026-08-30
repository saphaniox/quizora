import { Link } from "@tanstack/react-router";
import { HeartHandshake, LifeBuoy, ShieldCheck } from "lucide-react";

const links = [
  { to: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  { to: "/terms", label: "Terms of Service", icon: HeartHandshake },
  { to: "/support", label: "Support", icon: LifeBuoy },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <img
              src="/logo.png"
              alt=""
              className="h-8 w-8 rounded-md object-cover ring-1 ring-border"
            />
            <span>Quitech</span>
          </div>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            Learn, challenge & progress with practical quizzes for learners 13 and older.
          </p>
        </div>

        <nav className="flex flex-wrap gap-2" aria-label="Legal and support">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
