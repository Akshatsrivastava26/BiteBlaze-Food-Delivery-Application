import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { setAddress, setLocation } from "../redux/mapSlice";
import { useState } from "react";
import { useEffect } from "react";
import { serverUrl } from "../config/env";
import { addMyOrder } from "../redux/userSlice";
import { logger } from "../utils/logger";

function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    const hasValidLocation =
      typeof location?.lat === "number" && typeof location?.lon === "number";

    if (hasValidLocation) {
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
  }, [location, map]);

  return null;
}

function CheckOut() {
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount, userData } = useSelector(
    (state) => state.user,
  );
  const currentUser = userData?.user || userData;
  const backendLat = currentUser?.location?.coordinates?.[1];
  const backendLon = currentUser?.location?.coordinates?.[0];
  const hasValidLocation =
    typeof location?.lat === "number" && typeof location?.lon === "number";
  const mapCenter = hasValidLocation
    ? [location.lat, location.lon]
    : [28.6139, 77.209];
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEO_API_KEY;
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const AmountWithDeliveryFee = totalAmount + deliveryFee;

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  const getAddressByLatLng = async (lat, lon) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`,
      );
      dispatch(
        setAddress(
          result?.data?.results[0].formatted ||
            result?.data?.results[0].address_line1 ||
            result?.data?.results[0].address_line2,
        ),
      );
      setError("");
    } catch (error) {
      logger.error("Error fetching address", error);
      setError("Unable to fetch address for this location");
    }
  };
  const getCurrentLocation = () => {
    if (typeof backendLat !== "number" || typeof backendLon !== "number") {
      setError("Current location is not available yet");
      return;
    }

    setError("");
    dispatch(setLocation({ lat: backendLat, lon: backendLon }));
    getAddressByLatLng(backendLat, backendLon);
  };
  const getLatLngByAddress = async () => {
    if (addressInput.trim().length < 5) {
      setError("Please enter a more complete delivery address");
      return;
    }

    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`,
      );
      if (!result?.data?.features?.length) {
        setError("Address not found. Please refine your input.");
        return;
      }
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
      setError("");
    } catch (error) {
      logger.error("Error fetching lat/lng", error);
      setError("Unable to locate this address right now");
    }
  };

  const handlePlaceOrder = async () => {
    const validLocation =
      Number.isFinite(location?.lat) && Number.isFinite(location?.lon);
    if (!validLocation) {
      setError("Please select a valid delivery location");
      return;
    }

    if (addressInput.trim().length < 5) {
      setError("Please enter a valid delivery address");
      return;
    }

    if (!["cod", "online"].includes(paymentMethod)) {
      setError("Please select a valid payment method");
      return;
    }

    // safety check
    if (cartItems.length === 0) {
      setError("Cart is empty");
      return;
    }

    setError("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput.trim(),
            latitude: location.lat,
            longitude: location.lon,
          },
          totalAmount: AmountWithDeliveryFee,
          cartItems,
        },
        { withCredentials: true },
      );
      if (paymentMethod == "cod") {
        dispatch(addMyOrder(result.data?.order)); // Update Redux store with the new order
        navigate("/order-placed"); // optional redirect
      } else {
        const orderId = result.data?.orderId;
        const razorOrder = result.data?.razorOrder;
        openRazorpayWindow(orderId, razorOrder);
      }
    } catch (error) {
      logger.error("Order placement failed", error);
      setError(
        error.response?.data?.message ||
          "Something went wrong while placing order",
      );
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "BiteBlaze Ltd.",
      description: "Payment for order",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/order/verify-payment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              orderId,
            },
            { withCredentials: true },
          );
          dispatch(addMyOrder(result.data?.order)); // Update Redux store with the new order
          navigate("/order-placed");
        } catch (error) {
          logger.error("Payment verification failed", error);
          setError(
            error?.response?.data?.message || "Payment verification failed",
          );
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  useEffect(() => {
    if (
      !hasValidLocation &&
      typeof backendLat === "number" &&
      typeof backendLon === "number"
    ) {
      dispatch(setLocation({ lat: backendLat, lon: backendLon }));
      getAddressByLatLng(backendLat, backendLon);
    }
  }, [hasValidLocation, backendLat, backendLon, dispatch]);

  return (
    <div className="min-h-screen flex item-center justify-center px-3 sm:px-5 py-6">
      <div
        className="fixed top-22 sm:top-24 left-4 sm:left-6 z-20 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-(--brand-2)" />
      </div>
      <div className="w-full max-w-[980px] section-card p-4 sm:p-6 space-y-6 mt-8">
        <div>
          <p className="soft-badge mb-2">Secure checkout</p>
          <h1 className="section-title">Checkout</h1>
        </div>

        <section className="section-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-(--text-primary)">
            <IoLocationSharp className="text-(--brand-2)" />
            Delivery Location
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-(--border-soft) rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--brand-1)/20"
              placeholder="Enter Your Delivery Address..."
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button
              className="brand-gradient-bg text-white px-3 py-2 rounded-md flex items-center justify-center cursor-pointer"
              onClick={getLatLngByAddress}
            >
              <IoSearchOutline size={17} />
            </button>
            <button
              className="bg-(--accent-sky) text-(--text-primary) px-3 py-2 rounded-md flex items-center justify-center cursor-pointer"
              onClick={getCurrentLocation}
            >
              <TbCurrentLocation size={17} />
            </button>
          </div>
          <div className="rounded-lg border border-(--border-soft) overflow-hidden">
            <div className="h-64 w-full flex item-center justify-center">
              <MapContainer
                className={"w-full h-full"}
                center={mapCenter}
                zoom={17}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {hasValidLocation && <RecenterMap location={location} />}
                {hasValidLocation && (
                  <Marker
                    position={[location.lat, location.lon]}
                    draggable
                    eventHandlers={{ dragend: onDragEnd }}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </section>

        <section className="section-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold mb-3 text-(--text-primary)">
            Payment Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${paymentMethod === "cod" ? "border-(--brand-2) bg-(--bg-subtle) shadow-(--shadow-sm)" : "border-(--border-soft) hover:border-(--brand-1)"} cursor-pointer`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining />
              </span>
              <div>
                <p className="font-medium text-(--text-primary)">
                  Cash on Delivery (COD)
                </p>
                <p className="text-xs text-(--text-muted)">
                  Pay when you receive your delivery.
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${paymentMethod === "online" ? "border-(--brand-2) bg-(--bg-subtle) shadow-(--shadow-sm)" : "border-(--border-soft) hover:border-(--brand-1)"} cursor-pointer`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileScreenButton className="text-purple-700 text-lg" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FaCreditCard className="text-blue-700 text-lg" />
              </span>
              <div>
                <p className="font-medium text-(--text-primary)">
                  UPI / Credit / Debit Card
                </p>
                <p className="text-xs text-(--text-muted)">
                  Pay securely using your preferred method.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold mb-3 text-(--text-primary)">
            Order Summary
          </h2>
          <div className="rounded-lg border border-(--border-soft) bg-(--bg-surface) p-4 space-y-2">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-(--text-secondary)"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <hr className="border-(--border-soft) gap-y-2" />
            <div className="flex justify-between font-medium text-(--text-primary)">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-(--text-secondary)">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee == 0 ? "Free" : deliveryFee}</span>
            </div>
            <div className="flex justify-between text-lg font-bold brand-gradient-text pt-2">
              <span>Total</span>
              <span>₹{AmountWithDeliveryFee}</span>
            </div>
          </div>
        </section>

        <section className="mt-2">
          {error && <p className="text-red-500 text-center mb-3">{error}</p>}
          <button
            className="w-full brand-gradient-bg text-white py-3 rounded-md font-semibold cursor-pointer"
            onClick={handlePlaceOrder}
          >
            {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
          </button>
        </section>
      </div>
    </div>
  );
}

export default CheckOut;
