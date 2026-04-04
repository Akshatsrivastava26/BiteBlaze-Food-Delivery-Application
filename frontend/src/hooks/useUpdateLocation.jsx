import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config/env";
import { useSelector } from "react-redux";

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    if (!navigator.geolocation) {
      return;
    }

    const UpdateLocation = async (lat, lon) => {
      try {
        await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true },
        );
      } catch (error) {
        console.log("Error updating user location", error);
      }
    };

    const watchId = navigator.geolocation.watchPosition((pos) => {
      UpdateLocation(pos.coords.latitude, pos.coords.longitude);
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [userData]);
}

export default useUpdateLocation;
