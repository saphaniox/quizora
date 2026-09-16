import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { APP_VERSION, compareVersions, isUpdateRequired } from "@/lib/app-version";
import { getAppUpdateSettings } from "@/lib/api";

const SITE_URL = "app://quitech";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0f172a" },
      { title: "Quitech: Learn, Challenge & Progress" },
      {
        name: "description",
        content:
          "Learn, challenge & progress. Quitech helps you learn, challenge yourself, and track progress across technology, business, science, and general knowledge.",
      },
      { name: "application-name", content: "Quitech: Learn, Challenge & Progress" },
      { name: "author", content: "Quitech" },
      { property: "og:title", content: "Quitech: Learn, Challenge & Progress" },
      { property: "og:description", content: "Learn, challenge & progress." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/logo.png` },
      { property: "og:image:alt", content: "Quitech logo" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:site_name", content: "Quitech" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Quitech" },
      { name: "twitter:title", content: "Quitech: Learn, Challenge & Progress" },
      { name: "twitter:description", content: "Learn, challenge & progress." },
      { name: "twitter:url", content: SITE_URL },
      { name: "twitter:image", content: `${SITE_URL}/logo.png` },
      { name: "twitter:image:alt", content: "Quitech logo" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "canonical", href: SITE_URL },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
      { rel: "mask-icon", href: "/logo.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateDialog, setUpdateDialog] = useState<{
    required: boolean;
    message: string;
    storeUrl: string | null;
    currentVersion: string;
    latestVersion: string;
  } | null>(null);

  useEffect(() => {
    let active = true;

    async function checkForAppUpdate() {
      try {
        const { settings } = await getAppUpdateSettings();
        if (!active || !settings.enabled) return;

        const currentVersion = APP_VERSION;
        const minimumVersion = settings.minimumVersion || currentVersion;
        const latestVersion = settings.latestVersion || currentVersion;

        const shouldPrompt = isUpdateRequired(currentVersion, minimumVersion, latestVersion);
        if (!shouldPrompt) return;

        const required = settings.required && compareVersions(currentVersion, latestVersion) < 0;

        setUpdateDialog({
          required,
          message:
            settings.message || "A new app update is available. Please update to continue using Quitech.",
          storeUrl: settings.storeUrl,
          currentVersion,
          latestVersion,
        });
        setUpdateDialogOpen(true);
      } catch {
        // Ignore app-update checks when the API is unavailable or the user is signed out.
      }
    }

    void checkForAppUpdate();
    return () => {
      active = false;
    };
  }, []);

  const handleUpdate = () => {
    if (updateDialog?.storeUrl) {
      window.open(updateDialog.storeUrl, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.reload();
  };

  const requiredUpdateActive = Boolean(updateDialog?.required && updateDialogOpen);

  if (requiredUpdateActive) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-lg">
            <h1 className="text-2xl font-semibold text-foreground">Update required</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {updateDialog?.message || "A newer version of Quitech is required before continuing."}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Current: {updateDialog?.currentVersion ?? APP_VERSION} · Latest: {updateDialog?.latestVersion ?? APP_VERSION}
            </p>
            <button
              type="button"
              onClick={handleUpdate}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Update now
            </button>
          </div>
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <Toaster position="top-right" richColors closeButton />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />

        <AlertDialog
          open={updateDialogOpen}
          onOpenChange={(open) => {
            if (updateDialog?.required) return;
            setUpdateDialogOpen(open);
            if (!open && updateDialog && !updateDialog.required) {
              setUpdateDialog(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Update available</AlertDialogTitle>
              <AlertDialogDescription>
                {updateDialog?.message || "A new version of the app is ready."}
                {updateDialog && (
                  <span className="mt-2 block text-xs text-muted-foreground">
                    Current: {updateDialog.currentVersion} · Latest: {updateDialog.latestVersion}
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {!updateDialog?.required && (
                <AlertDialogCancel onClick={() => setUpdateDialog(null)}>Later</AlertDialogCancel>
              )}
              <AlertDialogAction onClick={handleUpdate}>
                {updateDialog?.required ? "Update now" : "Update"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </QueryClientProvider>
  );
}
