import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config/env";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice.js";
import { useSelector } from "react-redux";

function useGetMyShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const userRole = userData?.user?.role || userData?.role;

  useEffect(() => {
    if (!userData || userRole !== "owner") {
      dispatch(setMyShopData(null));
      return;
    }

    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(result.data));
      } catch (error) {
        if (![400, 401].includes(error?.response?.status)) {
          console.log(error);
        }
        dispatch(setMyShopData(null));
      }
    };
    fetchShop();
  }, [userData, userRole, dispatch]);
}

export default useGetMyShop;
