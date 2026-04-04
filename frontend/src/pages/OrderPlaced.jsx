import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import BrandButton from "../components/ui/BrandButton";

function OrderPlaced() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-xl section-card p-8 sm:p-10 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <FaCircleCheck className="text-green-600 text-5xl" />
        </div>
        <p className="soft-badge mb-3">Order confirmed</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-(--text-primary) mb-2">
          Order Placed Successfully
        </h1>
        <p className="text-(--text-muted) max-w-md mx-auto mb-7 leading-7">
          Thank you for your order. Your meal is now being prepared and will be
          on the way shortly. Track updates in real time from your orders page.
        </p>
        <div className="flex justify-center">
          <BrandButton
            className="px-6 py-3 text-base"
            onClick={() => navigate("/my-orders")}
          >
            Go To My Orders
          </BrandButton>
        </div>
      </div>
    </div>
  );
}

export default OrderPlaced;
