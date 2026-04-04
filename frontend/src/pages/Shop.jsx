import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../config/env";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FaStore } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaUtensils } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import FoodCard from "../components/FoodCard";
import { useNavigate } from "react-router-dom";
import { logger } from "../utils/logger";

function Shop() {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState([]);
  const navigate = useNavigate();
  const handleShop = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/get-by-shop/${shopId}`,
        { withCredentials: true },
      );
      setShop(result.data.shop);
      setItems(result.data.items);
    } catch (error) {
      logger.error("Fetch shop failed", error);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-transparent">
      <button
        className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-3 py-2 rounded-full shadow transition cursor-pointer"
        onClick={() => navigate("/")}
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      {shop && (
        <div className="relative w-full h-[280px] md:h-[340px] lg:h-[380px] rounded-xl overflow-hidden">
          <img
            src={shop.image}
            alt="Shop Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/45 to-black/35 flex flex-col justify-center items-center text-center px-4">
            <FaStore className="text-white text-4xl mb-3 drop-shadow-md" />
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              {shop.name}
            </h1>
            <div className="flex items-center gap-2.5 mt-2">
              <FaLocationDot size={20} color="#fda4af" />
              <p className="text-base md:text-lg font-medium text-gray-200">
                {shop.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-8">
        <div className="section-card p-5 sm:p-6">
          <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-8 text-(--text-primary)">
            <FaUtensils color="#ec4899" />
            Our Menu
          </h2>
          {items.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8">
              {items.map((item) => (
                <FoodCard data={item} key={item._id || item.id} />
              ))}
            </div>
          ) : (
            <p className="text-center text-(--text-muted) text-lg">
              No Items Available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
