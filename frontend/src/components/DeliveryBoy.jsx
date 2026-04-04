import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClipLoader } from "react-spinners";
import { logger } from "../utils/logger";

function DeliveryBoy() {
  const { userData, socket } = useSelector((state) => state.user);
  const currentUser = userData?.user || userData;

  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [otp, setOtp] = useState("");
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [todayDeliveriesStats, setTodayDeliveriesStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [assignmentMessage, setAssignmentMessage] = useState("");

  const ratePerDelivery = 50;
  const totalEarnings = todayDeliveriesStats.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0,
  );

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignment`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data?.assignments || []);
    } catch (error) {
      logger.error("GET ASSIGNMENT ERROR", error);
      setAssignmentMessage("Unable to fetch assignments right now");
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        {
          withCredentials: true,
        },
      );
      setCurrentOrder(result.data || null);
    } catch (error) {
      setCurrentOrder(null);
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-today-deliveries`,
        {
          withCredentials: true,
        },
      );
      setTodayDeliveriesStats(result.data?.stats || []);
    } catch (error) {
      logger.error("TODAY DELIVERIES ERROR", error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    setAssignmentMessage("");
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        {
          withCredentials: true,
        },
      );
      setAssignmentMessage(
        result.data?.message || "Order accepted successfully",
      );
      await getCurrentOrder();
      await getAssignments();
    } catch (error) {
      setAssignmentMessage(
        error?.response?.data?.message || "Could not accept order",
      );
      await getCurrentOrder();
      await getAssignments();
    }
  };

  const sendOtp = async () => {
    if (!currentOrder?._id || !currentOrder?.shopOrder?._id) return;

    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        { withCredentials: true },
      );
      setShowOtpBox(true);
    } catch (error) {
      logger.error("SEND OTP ERROR", error);
      setMessage(error?.response?.data?.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!currentOrder?._id || !currentOrder?.shopOrder?._id) return;

    setMessage("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true },
      );
      setMessage(result.data?.message || "OTP verified");
      setShowOtpBox(false);
      setOtp("");
      await getCurrentOrder();
      await handleTodayDeliveries();
    } catch (error) {
      logger.error("VERIFY OTP ERROR", error);
      setMessage(error?.response?.data?.message || "OTP verification failed");
    }
  };

  useEffect(() => {
    if (!socket || currentUser?.role !== "deliveryBoy") return;

    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setDeliveryBoyLocation({ lat: latitude, lon: longitude });

          socket.emit("updateLocation", {
            latitude,
            longitude,
            userId: currentUser?._id,
          });
        },
        (error) => {
          logger.warn("Location watch error", error);
        },
        {
          enableHighAccuracy: true,
        },
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, currentUser?._id, currentUser?.role]);

  useEffect(() => {
    if (!socket || !currentUser?._id) return;

    const handleNewAssignment = (data) => {
      if (String(data?.sentTo) === String(currentUser._id)) {
        setAvailableAssignments((prev) => [...prev, data]);
      }
    };

    socket.on("newAssignment", handleNewAssignment);
    return () => {
      socket.off("newAssignment", handleNewAssignment);
    };
  }, [socket, currentUser?._id]);

  useEffect(() => {
    if (!currentUser?._id) return;

    (async () => {
      await getAssignments();
      await getCurrentOrder();
      await handleTodayDeliveries();
    })();
  }, [currentUser?._id]);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2">
          <h1 className="text-xl font-bold text-[#ff4d2d]">
            Welcome, {currentUser?.fullName}!
          </h1>
          <p className="text-[#ff4d2d]">
            <span className="font-semibold">Latitude:</span>{" "}
            {deliveryBoyLocation?.lat ?? "-"},{" "}
            <span className="font-semibold">Longitude:</span>{" "}
            {deliveryBoyLocation?.lon ?? "-"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100">
          <h1 className="text-lg font-bold mb-3 text-[#ff4d2d]">
            Today's Deliveries
          </h1>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveriesStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDataOverflow={false} />
              <Tooltip
                formatter={(value) => [value, "orders"]}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey="count" fill="#ff4d2d" />
            </BarChart>
          </ResponsiveContainer>

          <div className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Today's Earnings:
            </h1>
            <span className="text-3xl font-bold text-green-600">
              ₹{totalEarnings}
            </span>
          </div>
        </div>

        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
              📦Available Orders
            </h1>
            {assignmentMessage && (
              <p className="text-sm text-[#ff4d2d] mb-3">{assignmentMessage}</p>
            )}
            <div className="space-y-4">
              {availableAssignments?.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <div
                    className="border rounded-lg p-4 flex justify-between items-center"
                    key={a?.assignmentId || index}
                  >
                    <div>
                      <p className="text-sm font-semibold">{a?.shopName}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Delivery Address:</span>{" "}
                        {a?.deliveryAddress?.text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {a?.items?.length || 0} items | ₹{a?.subtotal || 0}
                      </p>
                    </div>
                    <button
                      className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600 cursor-pointer"
                      onClick={() => acceptOrder(a.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No available orders.</p>
              )}
            </div>
          </div>
        )}

        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h2 className="text-lg font-bold mb-3">📦Current Order</h2>
            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">
                {currentOrder?.shopOrder?.shop?.name}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder?.deliveryAddress?.text}
              </p>
              <p className="text-xs text-gray-400">
                {currentOrder?.shopOrder?.shopOrderItems?.length || 0} items | ₹
                {currentOrder?.shopOrder?.subtotal || 0}
              </p>
            </div>

            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation: deliveryBoyLocation ||
                  currentOrder?.deliveryBoyLocation || { lat: null, lon: null },
                customerLocation: {
                  lat: currentOrder?.deliveryAddress?.latitude,
                  lon: currentOrder?.deliveryAddress?.longitude,
                },
              }}
            />

            {!showOtpBox ? (
              <button
                className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  "Mark As Delivered"
                )}
              </button>
            ) : (
              <div className="t-4 p-4 border rounded-xl bg-gray-50">
                <p className="text-sm font-semibold mb-2">
                  Enter OTP sent to{" "}
                  <span className="text-orange-500">
                    {currentOrder?.user?.fullName}
                  </span>
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />
                {message && (
                  <p className="text-center text-green-500 text-sm mb-4">
                    {message}
                  </p>
                )}
                <button
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all"
                  onClick={verifyOtp}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoy;
