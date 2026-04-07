import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Suspense } from "react";

import AppLayout from "./layouts/AppLayout";
import { protectedRoutes, publicRoutes } from "./routes/appRoutes";
import useAppBootstrap from "./hooks/useAppBootstrap";
import GlassCard from "./components/ui/GlassCard";

function FullPageLoader({ label = "Loading BiteBlaze experience..." }) {
  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-[radial-gradient(1000px_600px_at_20%_-10%,var(--brand-soft),transparent_55%),radial-gradient(900px_500px_at_90%_0%,var(--brand-haze),transparent_45%),var(--bg-canvas)] px-4">
      <GlassCard className="w-full max-w-md px-8 py-10 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-extrabold brand-gradient-text tracking-tight">
          BiteBlaze
        </h1>
        <div className="h-1.5 w-44 rounded-full bg-white/70 overflow-hidden">
          <div className="h-full w-1/2 brand-gradient-bg animate-pulse" />
        </div>
        <p className="text-(--text-muted) text-sm text-center">{label}</p>
      </GlassCard>
    </div>
  );
}

function PublicOnlyRoute({ isAuthenticated }) {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

function ProtectedRoute({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
}

function App() {
  const { loading, isAuthenticated } = useAppBootstrap();

  if (loading) {
    return <FullPageLoader label="Bootstrapping app state..." />;
  }

  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route element={<PublicOnlyRoute isAuthenticated={isAuthenticated} />}>
          {publicRoutes.map((route) => {
            const Page = route.component;
            return (
              <Route key={route.path} path={route.path} element={<Page />} />
            );
          })}
        </Route>

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<AppLayout />}>
            {protectedRoutes.map((route) => {
              const Page = route.component;
              return (
                <Route key={route.path} path={route.path} element={<Page />} />
              );
            })}
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/signin"} replace />}
        />
      </Routes>
    </Suspense>
  );
}
export default App;
