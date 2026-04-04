import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import { setSocket } from "../redux/userSlice";
import { serverUrl } from "../config/env";
import useGetCurrentUser from "./useGetCurrentUser";
import useGetCity from "./useGetCity";
import useGetMyShop from "./useGetMyShop";
import useGetShopByCity from "./useGetShopByCity";
import useGetItemsByCity from "./useGetItemsByCity";
import useGetMyOrders from "./useGetMyOrders";
import useUpdateLocation from "./useUpdateLocation";

function useAppBootstrap() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const userId = userData?.user?._id || userData?._id;

  const loading = useGetCurrentUser();
  useUpdateLocation();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();

  useEffect(() => {
    if (!userId) return;

    const socketInstance = io(serverUrl, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 800,
    });

    dispatch(setSocket(socketInstance));

    socketInstance.on("connect", () => {
      socketInstance.emit("identity", { userId });
    });

    return () => {
      socketInstance.disconnect();
      dispatch(setSocket(null));
    };
  }, [userId, dispatch]);

  return { loading, isAuthenticated: Boolean(userData) };
}

export default useAppBootstrap;
