import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

function AppLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_600px_at_20%_-10%,var(--brand-soft),transparent_55%),radial-gradient(900px_500px_at_90%_0%,var(--brand-haze),transparent_45%),var(--bg-canvas)] text-(--text-primary)">
      <Nav />
      <main className="pt-24 pb-16 px-3 sm:px-5 transition-all duration-300">
        <div className="max-w-7xl mx-auto w-full animate-app-fade">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-(--border-soft) bg-(--bg-elevated)/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-(--text-muted)">
          <p>
            <span className="font-semibold text-(--text-secondary)">BiteBlaze</span>{" "}
            • premium delivery experience
          </p>
          <p>Realtime orders • frictionless checkout • city-first discovery</p>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
