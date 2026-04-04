import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CartItemCard from "../components/CartItemCard";
import BrandButton from "../components/ui/BrandButton";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  return (
    <div className="min-h-screen flex justify-center px-3 sm:px-5 py-6">
      <div className="w-full max-w-[900px] section-card p-4 sm:p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="z-10 cursor-pointer" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className="text-(--brand-2)" />
          </div>
          <h1 className="section-title">Your Cart</h1>
        </div>
        {cartItems?.length == 0 ? (
          <p className="text-(--text-muted) text-lg text-center py-8">
            Your cart is empty
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems?.map((item, index) => (
                <CartItemCard data={item} key={index} />
              ))}
            </div>
            <div className="mt-6 bg-(--bg-elevated) p-4 rounded-lg shadow-(--shadow-sm) flex justify-between items-center border border-(--border-soft)">
              <h1 className="text-lg font-semibold">Total Amount</h1>
              <span className="text-xl font-bold brand-gradient-text">
                ₹{totalAmount}
              </span>
            </div>
            <div className="mt-4 flex justify-end">
              <BrandButton
                className="px-6 py-3 text-base"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </BrandButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
