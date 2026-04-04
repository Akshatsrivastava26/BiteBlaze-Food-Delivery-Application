import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../config/env";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";
import { logger } from "../utils/logger";

function TrackOrderPage() {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState();
  const navigate = useNavigate();
  const { socket, userData } = useSelector((state) => state.user);
  const currentUser = userData?.user || userData;
  const currentUserId = currentUser?._id;
  const [liveLocations, setLiveLocations] = useState({});
  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true },
      );
      const fetchedOrder = result.data?.order;
      const orderUserId = fetchedOrder?.user?._id;
      if (
        orderUserId &&
        currentUserId &&
        String(orderUserId) !== String(currentUserId)
      ) {
        setCurrentOrder(null);
        return;
      }
      setCurrentOrder(fetchedOrder);
    } catch (error) {
      logger.error("Error fetching order", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleDeliveryLocation = ({ deliveryBoyId, latitude, longitude }) => {
      const validLocation =
        Number.isFinite(latitude) && Number.isFinite(longitude);
      if (!validLocation || !deliveryBoyId) return;

      const allowedDeliveryBoyIds =
        currentOrder?.shopOrders
          ?.map((shopOrder) => shopOrder?.assignedDeliveryBoy?._id)
          .filter(Boolean) || [];
      if (!allowedDeliveryBoyIds.includes(deliveryBoyId)) return;

      setLiveLocations((prev) => ({
        ...prev,
        [deliveryBoyId]: { lat: latitude, lon: longitude },
      }));
    };

    socket.on("updateDeliveryLocation", handleDeliveryLocation);
    return () => {
      socket.off("updateDeliveryLocation", handleDeliveryLocation);
    };
  }, [socket, currentOrder]);

  useEffect(() => {
    handleGetOrder();
  }, [orderId, currentUserId]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-5 py-6 flex flex-col gap-6">
      <div
        className="relative flex items-center gap-4 z-10"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-(--brand-2)" />
        <h1 className="section-title">Track Order</h1>
      </div>

      {!currentOrder && (
        <div className="section-card p-6 text-center text-(--text-muted)">
          Order details are not available right now.
        </div>
      )}

      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <div className="section-card p-4 sm:p-5" key={index}>
          <div>
            <p className="text-lg font-bold mb-2 brand-gradient-text">
              {shopOrder.shopName || shopOrder?.shop?.name || "Shop"}
            </p>
            <p className="font-semibold text-(--text-primary)">
              <span>Items:</span>{" "}
              {shopOrder.shopOrderItems?.map((i) => i.name).join(", ") || "-"}
            </p>
            <p className="text-(--text-secondary)">
              <span className="font-semibold">Subtotal:</span> ₹
              {shopOrder.subtotal || 0}
            </p>
            <p className="mt-4 text-(--text-secondary)">
              <span className="font-semibold">Delivery Address:</span>{" "}
              {currentOrder?.deliveryAddress?.text || "Not available"}
            </p>
          </div>

          {shopOrder.status != "delivered" ? (
            <>
              {shopOrder.assignedDeliveryBoy ? (
                <div className="mt-3 text-sm text-(--text-secondary) section-card p-3">
                  <p className="font-semibold">
                    <span>Delivery Boy Name:</span>{" "}
                    {shopOrder.assignedDeliveryBoy.fullName}
                  </p>
                  <p className="font-semibold">
                    <span>Delivery Boy Contact No.:</span>{" "}
                    {shopOrder.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              ) : (
                <p className="font-semibold text-(--text-muted) mt-3">
                  No delivery boy assigned yet.
                </p>
              )}
            </>
          ) : (
            <p className="text-green-600 font-semibold text-lg mt-3">
              Delivered
            </p>
          )}

          {shopOrder.assignedDeliveryBoy && shopOrder.status != "delivered" && (
            <div className="h-[360px] sm:h-[400px] w-full rounded-lg overflow-hidden shadow-(--shadow-sm) mt-4 border border-(--border-soft)">
              <DeliveryBoyTracking
                data={{
                  deliveryBoyLocation: liveLocations[
                    shopOrder.assignedDeliveryBoy._id
                  ] || {
                    lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                    lon: shopOrder.assignedDeliveryBoy.location.coordinates[0],
                  },
                  customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lon: currentOrder.deliveryAddress.longitude,
                  },
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TrackOrderPage;
