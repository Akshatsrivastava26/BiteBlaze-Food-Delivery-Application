import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config/env";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice.js";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    if (!userData) {
      dispatch(setMyOrders([]));
      return;
    }

    const fetchOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
        });
        dispatch(setMyOrders(result.data?.orders || []));
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, [userData, dispatch]);
}

export default useGetMyOrders;
