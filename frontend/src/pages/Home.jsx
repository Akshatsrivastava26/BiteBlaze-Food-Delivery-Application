import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import DeliveryBoy from "../components/DeliveryBoy";

function Home() {
  const actualUser = useSelector((state) => state.user?.userData?.user);

  if (!actualUser) {
    return (
      <div className="w-full min-h-[calc(100vh-9rem)] flex justify-center items-center">
        <div className="section-card px-8 py-7 text-center">
          <h2 className="text-2xl font-bold brand-gradient-text">Vingo</h2>
          <p className="text-(--text-muted) mt-2">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-9rem)] flex flex-col gap-4">
      {actualUser.role === "user" && <UserDashboard />}
      {actualUser.role === "owner" && <OwnerDashboard />}
      {actualUser.role === "deliveryBoy" && <DeliveryBoy />}
    </div>
  );
}

export default Home;
