import React from "react";
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { useSelector } from "react-redux";

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar
            key={`star-filled-${i}`}
            className="text-yellow-500 text-lg"
          />
        ) : (
          <FaRegStar
            key={`star-empty-${i}`}
            className="text-yellow-500 text-lg"
          />
        ),
      );
    }
    return stars;
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
  };
  const handleDecrease = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
    }
  };

  return (
    <div className="w-[260px] rounded-lg border border-(--border-soft) bg-(--bg-elevated) shadow-(--shadow-sm) overflow-hidden hover:shadow-(--shadow-md) transition-all duration-300 flex flex-col">
      <div className="relative w-full h-[170px] flex justify-center items-center bg-(--bg-surface)">
        <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 shadow-(--shadow-sm)">
          {data.foodType == "Veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-lg" />
          )}
        </div>

        <img
          src={data.image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h1 className="font-semibold text-(--text-primary) text-base truncate">
          {data.name}
        </h1>

        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs text-(--text-muted)">
            {data.rating?.count || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto p-3">
        <span className="font-bold text-(--text-primary) text-lg">
          ₹{data.price}
        </span>

        <div className="flex items-center border border-(--border-soft) rounded-full overflow-hidden shadow-sm bg-white">
          <button
            className="px-2 py-1 hover:bg-(--bg-subtle) transition"
            onClick={handleDecrease}
          >
            <FaMinus size={12} />
          </button>
          <span className="min-w-6 text-center text-sm font-semibold">
            {quantity}
          </span>
          <button
            className="px-2 py-1 hover:bg-(--bg-subtle) transition"
            onClick={handleIncrease}
          >
            <FaPlus size={12} />
          </button>
          <button
            className={`${cartItems.some((i) => i.id == data._id) ? "bg-(--text-primary)" : "brand-gradient-bg"} text-white px-3 py-2 transition-colors`}
            onClick={() => {
              quantity > 0
                ? dispatch(
                    addToCart({
                      id: data._id,
                      name: data.name,
                      price: data.price,
                      image: data.image,
                      shop: data.shop,
                      quantity: quantity,
                      foodType: data.foodType,
                    }),
                  )
                : null;
            }}
          >
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
