import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config/env";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity } from "../redux/userSlice.js";

function useGetItemsByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentCity || currentCity === "null" || currentCity === "undefined") {
      dispatch(setItemsInMyCity([]));
      return;
    }

    const fetchItems = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${currentCity}`,
          { withCredentials: true },
        );
        dispatch(setItemsInMyCity(result.data));
      } catch (error) {
        console.log("Error in fetching items", error);
      }
    };
    fetchItems();
  }, [currentCity, dispatch]);
}

export default useGetItemsByCity;
