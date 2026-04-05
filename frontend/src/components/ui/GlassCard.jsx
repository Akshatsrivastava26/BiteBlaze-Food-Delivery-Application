import React from "react";

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`backdrop-blur-xl bg-white/70 border border-white/70 rounded-xl shadow-(--shadow-md) ${className}`}
    >
      {children}
    </div>
  );
}

export default GlassCard;
