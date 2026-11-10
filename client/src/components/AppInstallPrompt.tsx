import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { androidAppUrl } from "@/lib/share-links";

const DISMISSED_KEY = "quitech-install-prompt-dismissed-this-session";
const ANDROID_PACKAGE_ID = "com.saptechug.quitech";

type InstallPlatform = "android" | "ios" | "windows";

interface InstallChoice {
  outcome: "accepted" | "dismissed";
}

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
}

interface RelatedApp {
  id?: string;
  platform?: string;
}

interface NavigatorWithInstall extends Navigator {
  getInstalledRelatedApps?: () => Promise<RelatedApp[]>;
  standalone?: boolean;
}

function getInstallPlatform(): InstallPlatform | null {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) return "android";
  if (
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  ) {
    return "ios";
  }
  if (/Windows/i.test(userAgent)) return "windows";
  return null;
}

function isInstalled(): boolean {
  const nav = navigator as NavigatorWithInstall;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    nav.standalone === true
  );
}

function saveDismissedThisSession(): void {
  try {
    window.sessionStorage.setItem(DISMISSED_KEY, "true");
  } catch (error) {
    console.warn("Could not save app install prompt preference", error);
  }
}

export function AppInstallPrompt() {
  const [platform, setPlatform] = useState<InstallPlatform | null>(null);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isInstalled()) return;

    const detectedPlatform = getInstallPlatform();
    if (!detectedPlatform) return;

    let active = true;
    let alreadyInstalled = false;
    try {
      alreadyInstalled = window.sessionStorage.getItem(DISMISSED_KEY) === "true";
    } catch (error) {
      console.warn("Could not read app install prompt preference", error);
    }

    const nav = navigator as NavigatorWithInstall;
    const checkRelatedApp = async () => {
      if (detectedPlatform !== "android" || !nav.getInstalledRelatedApps) return;
      try {
        const apps = await nav.getInstalledRelatedApps();
        if (apps.some((app) => app.platform === "play" && app.id === ANDROID_PACKAGE_ID)) {
          alreadyInstalled = true;
        }
      } catch (error) {
        console.warn("Could not check for the installed Quitech app", error);
      }
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    const handleAppInstalled = () => {
      alreadyInstalled = true;
      setVisible(false);
    };
    const handleModalOverlay = (event: Event) => {
      setModalOpen((event as CustomEvent<unknown>).detail === true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("quitech:modal-overlay", handleModalOverlay);

    void checkRelatedApp().then(() => {
      if (!active || alreadyInstalled) return;
      setPlatform(detectedPlatform);
      window.setTimeout(() => {
        if (active) setVisible(true);
      }, 5000);
    });

    return () => {
      active = false;
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("quitech:modal-overlay", handleModalOverlay);
    };
  }, []);

  if (!visible || !platform || modalOpen) return null;

  const dismiss = () => {
    saveDismissedThisSession();
    setVisible(false);
  };

  const install = async () => {
    if (platform === "android") {
      saveDismissedThisSession();
      setVisible(false);
      window.open(androidAppUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      setInstallEvent(null);
      if (choice.outcome === "accepted") {
        saveDismissedThisSession();
        setVisible(false);
      }
      return;
    }

    setShowInstructions((current) => !current);
  };

  return (
    <aside
      role="region"
      aria-label="Install Quitech"
      className="fixed inset-x-3 z-50 mx-auto max-w-lg rounded-xl border border-border bg-card p-3 text-card-foreground shadow-xl sm:inset-x-4 sm:p-4"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Download className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Take Quitech with you</p>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            {platform === "android"
              ? "Get the Quitech app on Google Play."
              : "Add Quitech to your device for quick, full-screen access."}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void install()}
              className="inline-flex min-h-9 items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              {platform === "android"
                ? "Get it on Google Play"
                : installEvent
                  ? "Install app"
                  : "How to install"}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="min-h-9 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          {showInstructions && (
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {platform === "ios"
                ? "In Safari, tap Share, then choose Add to Home Screen."
                : "In your browser menu, choose Install Quitech or Apps, then Install this site as an app."}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install message"
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
