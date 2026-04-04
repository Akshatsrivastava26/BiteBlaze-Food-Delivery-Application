import React from "react";

function BrandButton({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const variantClass =
    variant === "ghost"
      ? "bg-white/80 border border-(--border-soft) text-(--text-primary) hover:bg-white"
      : "brand-gradient-bg text-white border border-white/20 shadow-(--shadow-lg) hover:brightness-110";

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-(--radius-md) text-sm font-semibold transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-(--brand-1)/30 ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default BrandButton;
