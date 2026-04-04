import React from "react";

function CategoryCard({ name, image, onClick }) {
  return (
    <div
      className="w-[132px] h-[132px] sm:w-[150px] sm:h-[150px] md:w-[178px] md:h-[178px] rounded-lg shrink-0 overflow-hidden bg-(--bg-elevated) shadow-(--shadow-sm) hover:shadow-(--shadow-md) transition-all duration-300 relative border border-(--border-soft) cursor-pointer"
      onClick={onClick}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2 bg-white/82 backdrop-blur-md rounded-md px-2 py-1 text-center text-xs sm:text-sm font-semibold text-(--text-secondary)">
        {name}
      </div>
    </div>
  );
}

export default CategoryCard;
