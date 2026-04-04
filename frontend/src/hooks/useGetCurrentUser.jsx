import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../config/env";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

function useGetCurrentUser() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if we don't have user data yet
    if (userData) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current-user`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        if (![400, 401].includes(error?.response?.status)) {
          console.log("Error in fetching current user", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userData, dispatch]);

  return loading;
}

export default useGetCurrentUser;
