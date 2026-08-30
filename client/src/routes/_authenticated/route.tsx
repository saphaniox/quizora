import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "@/lib/api";

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
  component: () => <Outlet />,
});
