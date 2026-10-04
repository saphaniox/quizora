import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { getCurrentUser, updatePresence } from "@/lib/api";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    try {
      const { user } = await getCurrentUser();
      if (!user) {
        throw redirect({ to: "/auth", search: { next: location.pathname } as never });
      }
      return { user };
    } catch (error) {
      if (error instanceof Response) throw error;
      throw redirect({
        to: "/auth",
        search: { next: location.pathname, accountApi: "offline" } as never,
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext();

  useEffect(() => {
    let active = true;
    let requestPending = false;
    let failureLogged = false;

    const sendHeartbeat = async () => {
      if (
        !active ||
        requestPending ||
        document.visibilityState !== "visible" ||
        !navigator.onLine
      ) {
        return;
      }

      requestPending = true;
      try {
        await updatePresence();
        failureLogged = false;
      } catch (error) {
        if (!failureLogged) {
          console.warn("Could not refresh online presence", error);
          failureLogged = true;
        }
      } finally {
        requestPending = false;
      }
    };

    const handleAvailable = () => void sendHeartbeat();
    const interval = window.setInterval(handleAvailable, 30_000);
    document.addEventListener("visibilitychange", handleAvailable);
    window.addEventListener("focus", handleAvailable);
    window.addEventListener("online", handleAvailable);
    void sendHeartbeat();

    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleAvailable);
      window.removeEventListener("focus", handleAvailable);
      window.removeEventListener("online", handleAvailable);
    };
  }, [user.id]);

  return <Outlet />;
}
