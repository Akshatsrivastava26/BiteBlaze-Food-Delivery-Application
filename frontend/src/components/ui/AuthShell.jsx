import React from "react";
import GlassCard from "./GlassCard";

function AuthShell({ title, subtitle, sideTitle, sideDescription, children }) {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(900px_500px_at_15%_-10%,var(--brand-soft),transparent_55%),radial-gradient(800px_450px_at_90%_5%,var(--brand-haze),transparent_45%),var(--bg-canvas)] px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        <div className="hidden lg:flex surface-card p-10 flex-col justify-between">
          <div>
            <p className="inline-flex items-center rounded-full bg-white/90 border border-(--border-soft) px-3 py-1 text-xs font-semibold text-(--text-secondary) mb-6">
              Food commerce, redesigned
            </p>
            <h1 className="text-4xl leading-tight font-extrabold text-(--text-primary) mb-3">
              {sideTitle}
            </h1>
            <p className="text-(--text-muted) text-base leading-7 max-w-md">
              {sideDescription}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm text-(--text-secondary)">
            <div className="surface-card p-3">
              <p className="font-bold text-xl brand-gradient-text">30m</p>
              <p>Avg Delivery</p>
            </div>
            <div className="surface-card p-3">
              <p className="font-bold text-xl brand-gradient-text">4.8</p>
              <p>User Rating</p>
            </div>
            <div className="surface-card p-3">
              <p className="font-bold text-xl brand-gradient-text">24x7</p>
              <p>Live Tracking</p>
            </div>
          </div>
        </div>

        <GlassCard className="w-full max-w-xl mx-auto p-6 sm:p-8 md:p-10">
          <div className="mb-7">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight brand-gradient-text">
              {title}
            </h2>
            <p className="text-(--text-muted) mt-2 leading-6">{subtitle}</p>
          </div>
          {children}
        </GlassCard>
      </div>
    </div>
  );
}

export default AuthShell;
