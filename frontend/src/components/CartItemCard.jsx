import React from "react";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { removeCartItem, updateQuantity } from "../redux/userSlice";

function CartItemCard({ data }) {
  const dispatch = useDispatch();
  const qty = Math.max(1, Number(data?.quantity ?? 1));
  const price = Math.max(0, Number(data?.price ?? 0));
  const total = price * qty;

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-(--bg-elevated) p-4 rounded-lg shadow-(--shadow-sm) border border-(--border-soft) transition-all duration-300 hover:-translate-y-0.5 hover:shadow-(--shadow-md)">
      <div className="flex items-center gap-4 min-w-0">
        <img
          src={data?.image}
          alt={data?.name || "Cart item"}
          className="w-20 h-20 object-cover rounded-md border border-(--border-soft)"
        />
        <div className="min-w-0">
          <h1 className="font-semibold text-(--text-primary) truncate">
            {data?.name || "Item"}
          </h1>
          <p className="text-sm text-(--text-muted)">
            ₹{price} x {qty}
          </p>
          <p className="font-bold text-(--text-primary)">Total: ₹{total}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          className="h-9 w-9 inline-flex items-center justify-center bg-(--bg-subtle) rounded-full border border-(--border-soft) hover:brightness-95 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => handleDecrease(data?.id, qty)}
          disabled={qty <= 1}
          aria-label="Decrease quantity"
        >
          <FaMinus size={12} />
        </button>
        <span className="min-w-7 text-center text-sm font-semibold text-(--text-secondary)">
          {qty}
        </span>
        <button
          className="h-9 w-9 inline-flex items-center justify-center bg-(--bg-subtle) rounded-full border border-(--border-soft) hover:brightness-95 transition cursor-pointer"
          onClick={() => handleIncrease(data?.id, qty)}
          aria-label="Increase quantity"
        >
          <FaPlus size={12} />
        </button>
        <button
          className="h-9 w-9 inline-flex items-center justify-center bg-rose-50 text-rose-600 rounded-full border border-rose-100 hover:bg-rose-100 transition cursor-pointer"
          onClick={() => dispatch(removeCartItem(data?.id))}
          aria-label="Remove item from cart"
        >
          <CiTrash size={18} />
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
