import axios from "axios";
import React from "react";
import { MdPhone } from "react-icons/md";
import { serverUrl } from "../config/env";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";
import { useState } from "react";
import { logger } from "../utils/logger";

function OwnerOrderCard({ data }) {
  const [availableBoys, setAvailableBoys] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(
    data?.shopOrders?.status || "",
  );
  const dispatch = useDispatch();
  const user = data?.user || {};
  const shopOrder = data?.shopOrders || {};
  const deliveryAddress = data?.deliveryAddress || {};
  const orderItems = shopOrder?.shopOrderItems || [];
  const displayTotal = Math.max(
    0,
    Number(data?.shopOrders?.subtotal ?? data?.totalAmount ?? 0),
  );

  const handleUpdateStatus = async (orderId, shopId, status) => {
    if (!status) {
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true },
      );
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(result.data?.availableBoys || []);
      setStatusMessage("Status updated successfully.");
    } catch (error) {
      logger.error("Error updating order status", error);
      setStatusMessage(
        error?.response?.data?.message || "Could not update order status.",
      );
    }
  };
  return (
    <div className="surface-card p-5 space-y-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-(--shadow-md)">
      {/* information about user */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-(--text-primary)">
            {user?.fullName || "Customer"}
          </h2>
          <span className="inline-flex rounded-full border border-(--border-soft) bg-(--bg-subtle) px-2.5 py-1 text-xs font-semibold capitalize text-(--text-secondary)">
            {shopOrder?.status || "pending"}
          </span>
        </div>
        <p className="text-sm text-(--text-muted) break-all">
          {user?.email || "No email"}
        </p>
        <p className="flex items-center gap-2 text-sm text-(--text-muted) mt-1">
          <MdPhone /> <span>{user?.mobileNumber || "No phone"}</span>
        </p>
        {data?.paymentMethod === "online" ? (
          <p className="gap-2 text-sm text-(--text-muted)">
            Payment: {data?.payment ? "Paid" : "Not Paid"}
          </p>
        ) : (
          <p className="gap-2 text-sm text-(--text-muted)">
            Payment Method: {data?.paymentMethod}
          </p>
        )}
      </div>
      {/* delivery address of user */}
      <div className="flex items-start flex-col gap-2 rounded-md border border-(--border-soft) bg-(--bg-subtle) p-3 text-(--text-muted) text-sm">
        <p>{deliveryAddress?.text || "Address unavailable"}</p>
        <p className="text-xs text-(--text-subtle)">
          Lat: {deliveryAddress?.latitude ?? "-"}, Lon:{" "}
          {deliveryAddress?.longitude ?? "-"}
        </p>
      </div>
      {/* mapping shop orders here */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {orderItems.map((item, index) => (
          <div
            key={index}
            className="shrink-0 w-40 border border-(--border-soft) rounded-md p-2.5 bg-(--bg-elevated)"
          >
            {item?.item?.image ? (
              <img
                src={item.item.image}
                alt={item?.name || item?.item?.name || "order item"}
                className="w-full h-24 object-cover rounded"
              />
            ) : (
              <div className="w-full h-24 rounded bg-(--bg-subtle) flex items-center justify-center text-xs text-(--text-subtle)">
                Image not available
              </div>
            )}
            <p className="text-sm font-semibold mt-1 text-(--text-primary)">
              {item?.name || item?.item?.name || "Item"}
            </p>
            <p className="text-xs text-(--text-subtle)">
              Qty: {item?.quantity ?? 0} x ₹{item?.price ?? 0}
            </p>
          </div>
        ))}
      </div>
      {/* status update option for owner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mt-auto pt-3 border-t border-(--border-soft)">
        <span className="text-sm text-(--text-secondary)">
          Status:
          <span className="font-semibold capitalize text-(--brand-2) ml-1">
            {shopOrder?.status || "pending"}
          </span>
        </span>
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-(--border-soft) bg-white px-3 py-1.5 text-sm text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--brand-2)/30 cursor-pointer"
            value={selectedStatus}
            disabled={!shopOrder?.shop?._id}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="out for delivery">Out for Delivery</option>
          </select>
          <button
            className="px-3 py-1.5 text-sm rounded-md brand-gradient-bg text-white cursor-pointer disabled:opacity-60"
            disabled={
              !selectedStatus ||
              selectedStatus === shopOrder?.status ||
              !shopOrder?.shop?._id
            }
            onClick={() =>
              handleUpdateStatus(data._id, shopOrder.shop._id, selectedStatus)
            }
          >
            Confirm
          </button>
        </div>
      </div>
      {statusMessage && (
        <p className="text-xs text-(--text-muted)">{statusMessage}</p>
      )}
      {/* when status is out for delivery then show assigned delivery boy details and also show available delivery */}
      {shopOrder?.status === "out for delivery" && (
        <div className="mt-3 p-3 border border-(--border-soft) rounded-md text-sm bg-(--bg-subtle)">
          {shopOrder?.assignedDeliveryBoy ? (
            <p>Assigned Delivery Boy:</p>
          ) : (
            <p>Available Delivery Boys:</p>
          )}
          {availableBoys.length > 0 ? (
            availableBoys.map((b, index) => (
              <div className="text-(--text-secondary)" key={b?.id || index}>
                {b?.fullname || "Delivery partner"} - {b?.mobile || "No phone"}
              </div>
            ))
          ) : shopOrder?.assignedDeliveryBoy ? (
            <div className="text-(--text-secondary)">
              {shopOrder?.assignedDeliveryBoy?.fullName || "Delivery partner"} -
              {shopOrder?.assignedDeliveryBoy?.mobile || "No phone"}
            </div>
          ) : (
            <div className="text-(--text-subtle)">
              Waiting for available delivery partners...
            </div>
          )}
        </div>
      )}
      {/* Grant Total */}
      <div className="text-right font-bold text-(--text-primary) text-sm">
        Total: ₹{displayTotal}
      </div>
    </div>
  );
}

export default OwnerOrderCard;
