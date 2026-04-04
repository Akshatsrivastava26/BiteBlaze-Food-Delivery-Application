import React from "react";
import { useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addMyOrder, updateRealtimeOrderStatus } from "../redux/userSlice";

function MyOrders() {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const currentUser = userData?.user || userData;
  const userRole = currentUser?.role;
  const currentUserId = currentUser?._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleNewOrder = (data) => {
      const incomingOrderId = data?._id;
      if (
        !incomingOrderId ||
        myOrders?.some((order) => order?._id === incomingOrderId)
      ) {
        return;
      }

      const incomingOwnerId =
        data?.shopOrders?.owner?._id || data?.shopOrders?.[0]?.owner?._id;
      const incomingUserId = data?.user?._id;

      if (
        userRole === "owner" &&
        String(incomingOwnerId) !== String(currentUserId)
      ) {
        return;
      }
      if (
        userRole === "user" &&
        String(incomingUserId) !== String(currentUserId)
      ) {
        return;
      }

      dispatch(addMyOrder(data));
    };

    const handleStatusUpdate = ({ orderId, shopId, status, userId }) => {
      if (!orderId || !shopId || !status || !userId) return;
      if (String(userId) !== String(currentUserId)) return;
      dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }));
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("update-status", handleStatusUpdate);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("update-status", handleStatusUpdate);
    };
  }, [socket, currentUserId, userRole, myOrders, dispatch]);
  return (
    <div className="w-full min-h-screen flex justify-center px-3 sm:px-5 py-6">
      <div className="w-full max-w-[920px] section-card p-4 sm:p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="z-10 cursor-pointer" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack
              size={35}
              className="text-(--brand-2) cursor-pointer"
            />
          </div>
          <h1 className="section-title">My Orders</h1>
        </div>

        <div className="space-y-6">
          {(!myOrders || myOrders.length === 0) && (
            <div className="bg-(--bg-elevated) rounded-lg shadow-(--shadow-sm) p-6 text-(--text-muted) text-center border border-(--border-soft)">
              No orders yet.
            </div>
          )}
          {myOrders?.map((order) =>
            userRole == "user" ? (
              <UserOrderCard data={order} key={order._id} />
            ) : userRole == "owner" ? (
              <OwnerOrderCard data={order} key={order._id} />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
