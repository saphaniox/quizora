import { Link } from "@tanstack/react-router";
import { Download, HeartHandshake, LifeBuoy, Music2, ShieldCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { androidAppUrl } from "@/lib/share-links";

const links = [
  { to: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  { to: "/terms", label: "Terms of Service", icon: HeartHandshake },
  { to: "/support", label: "Support", icon: LifeBuoy },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <img
              src="/logo.png"
              alt=""
              className="h-8 w-8 rounded-md object-cover ring-1 ring-border"
            />
            <span>Quitech</span>
          </div>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            Learn, challenge & progress with practical quizzes for learners 13 and above.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">Powered by</span>
            <a
              href="https://saptechug.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-amber-700 underline decoration-amber-300 underline-offset-4 transition-colors hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200"
            >
              SAPTech Uganda
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              href={androidAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary/80"
            >
              <Download className="h-3.5 w-3.5" />
              Get the app on Google Play
            </a>
          </div>
        </div>

        <nav
          className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:w-auto lg:grid-cols-6"
          aria-label="Legal, support, and social links"
        >
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:justify-start"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <a
            href="https://wa.me/256706564628"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 lg:justify-start"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
            WhatsApp Support
          </a>
          <a
            href="https://www.tiktok.com/@saptechug"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent lg:justify-start"
            aria-label="Follow SAPTech Uganda on TikTok"
          >
            <Music2 className="h-4 w-4" />
            Follow us on TikTok
          </a>
          <a
            href="https://whatsapp.com/channel/0029VaCnZ7N1SWt8esJuGa0Q"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent lg:justify-start"
            aria-label="Follow the SAPTech Uganda WhatsApp channel"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
            Follow our WhatsApp channel
          </a>
        </nav>
      </div>
    </footer>
  );
}
