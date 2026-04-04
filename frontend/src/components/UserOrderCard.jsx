import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../config/env";
import { logger } from "../utils/logger";

function UserOrderCard({ data }) {
  const navigate = useNavigate();
  const orderIdLabel = data?._id ? String(data._id).slice(-6) : "------";
  const shopOrders = Array.isArray(data?.shopOrders) ? data.shopOrders : [];

  const [selectedRating, setSelectedRating] = useState({}); //itemId:rating
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRating = async (itemId, rating) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true },
      );
      setSelectedRating((prev) => ({ ...prev, [itemId]: rating }));
    } catch (error) {
      logger.error("RATING ERROR", error);
    }
  };
  return (
    <div className="bg-(--bg-elevated) rounded-lg shadow-(--shadow-sm) p-4 sm:p-5 space-y-4 border border-(--border-soft)">
      <div className="flex justify-between items-start border-b border-(--border-soft) pb-3">
        <div>
          <p className="font-semibold text-(--text-primary)">
            Order #{orderIdLabel}
          </p>
          <p className="text-sm text-(--text-muted)">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>

        <div className="text-right">
          {data.paymentMethod == "cod" ? (
            <p className="text-sm text-(--text-muted)">
              {data.paymentMethod?.toUpperCase()}
            </p>
          ) : (
            <p className="text-sm text-(--text-muted) font-semibold">
              Payment: {data.payment ? "Paid" : "Not Paid"}
            </p>
          )}

          <p className="font-medium text-(--brand-2)">
            {shopOrders?.[0]?.status || "pending"}
          </p>
        </div>
      </div>

      {shopOrders.map((shopOrder, index) => (
        <div
          className="border border-(--border-soft) rounded-md p-4 bg-white/80"
          key={index}
        >
          <p className="font-semibold text-(--text-primary)">
            {shopOrder?.shop?.name || "Shop unavailable"}
          </p>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {shopOrder.shopOrderItems?.map((item, index) => (
              <div
                key={index}
                className="shrink-0 w-40 border border-(--border-soft) rounded-md p-2 bg-white"
              >
                {item?.item?.image ? (
                  <img
                    src={item.item.image}
                    alt={item.name}
                    className="w-full h-24 object-cover rounded-sm"
                  />
                ) : (
                  <div className="w-full h-24 rounded-sm bg-(--bg-subtle) flex items-center justify-center text-xs text-(--text-muted)">
                    Image not available
                  </div>
                )}
                <p className="text-sm font-semibold mt-1">
                  {item?.name || item?.item?.name || "Item"}
                </p>
                <p className="text-xs text-gray-500">
                  Qty: {item?.quantity || 0} x ₹{item?.price || 0}{" "}
                </p>

                {shopOrder.status == "delivered" && item?.item?._id && (
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`${selectedRating[item.item._id] >= star ? "text-yellow-400" : "text-gray-400"}`}
                        onClick={() => handleRating(item.item._id, star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center border-t border-(--border-soft) pt-2 mt-2">
            <p className="font-semibold">
              Subtotal: ₹{shopOrder?.subtotal || 0}
            </p>
            <span className="text-sm font-medium text-(--brand-2)">
              {shopOrder?.status || "pending"}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center border-t border-(--border-soft) pt-3">
        <p className="font-semibold">Total: ₹{data?.totalAmount || 0}</p>
        <button
          className="brand-gradient-bg text-white px-4 py-2 rounded-md text-sm font-semibold cursor-pointer"
          onClick={() => data?._id && navigate(`/track-order/${data._id}`)}
        >
          Track Order
        </button>
      </div>
    </div>
  );
}

export default UserOrderCard;
