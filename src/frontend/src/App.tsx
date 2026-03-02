import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { DashboardPage } from "./pages/DashboardPage";
import { GalleryPage } from "./pages/GalleryPage";
import { LandingPage } from "./pages/LandingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { UploadPage } from "./pages/UploadPage";

// ─── Layout ─────────────────────────────────────────────────────────────────

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}

// ─── Auth Guard ─────────────────────────────────────────────────────────────

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" />
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-10">
          <div className="bg-primary/10 rounded-2xl p-5 w-fit mx-auto mb-5">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-3">
            Sign in to continue
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Please sign in to access this page
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ─── Routes ─────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: GalleryPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  ),
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: () => (
    <AuthGuard>
      <UploadPage />
    </AuthGuard>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  galleryRoute,
  dashboardRoute,
  uploadRoute,
  profileRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
