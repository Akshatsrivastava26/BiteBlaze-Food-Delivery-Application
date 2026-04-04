import React, { useEffect } from "react";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaChevronCircleRight } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(
    (state) => state.user,
  );
  const cateScrollRef = React.useRef();
  const shopScrollRef = React.useRef();
  const navigate = useNavigate();
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);

  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filteredList = itemsInMyCity.filter((i) => i.category === category);
      setUpdatedItemsList(filteredList);
    }
  };

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 0);
      setRightButton(
        element.scrollWidth > element.clientWidth + element.scrollLeft,
      );
    }
  };
  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const cateElement = cateScrollRef.current;
    const shopElement = shopScrollRef.current;

    const handleCateScroll = () => {
      updateButton(
        cateScrollRef,
        setShowLeftCateButton,
        setShowRightCateButton,
      );
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton,
      );
    };

    const handleShopScroll = () => {
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton,
      );
    };

    if (cateElement) {
      updateButton(
        cateScrollRef,
        setShowLeftCateButton,
        setShowRightCateButton,
      );
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton,
      );
      cateElement.addEventListener("scroll", handleCateScroll);
    }

    if (shopElement) {
      shopElement.addEventListener("scroll", handleShopScroll);
    }

    return () => {
      if (cateElement) {
        cateElement.removeEventListener("scroll", handleCateScroll);
      }
      if (shopElement) {
        shopElement.removeEventListener("scroll", handleShopScroll);
      }
    };
  }, [categories]);

  return (
    <div className="w-full min-h-screen flex flex-col gap-6 items-center overflow-y-auto px-1">
      <section className="w-full max-w-6xl section-card px-5 py-6 sm:px-6 sm:py-7 mt-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="soft-badge mb-3">User dashboard</p>
            <h1 className="section-title">Find food you will crave again</h1>
            <p className="text-(--text-muted) mt-1">
              Discover top dishes and best-rated shops around{" "}
              {currentCity || "your city"}.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="surface-card px-4 py-3 text-center">
              <p className="font-extrabold text-xl brand-gradient-text">
                {shopInMyCity?.length || 0}
              </p>
              <p className="text-xs text-(--text-muted)">Shops</p>
            </div>
            <div className="surface-card px-4 py-3 text-center">
              <p className="font-extrabold text-xl brand-gradient-text">
                {itemsInMyCity?.length || 0}
              </p>
              <p className="text-xs text-(--text-muted)">Items</p>
            </div>
          </div>
        </div>
      </section>

      {searchItems && searchItems.length > 0 && (
        <section className="w-full max-w-6xl section-card p-5 sm:p-6">
          <h1 className="section-title mb-4">Search Results</h1>
          <div className="w-full h-auto flex flex-wrap gap-6 justify-center">
            {searchItems.map((item) => (
              <FoodCard key={item._id} data={item} />
            ))}
          </div>
        </section>
      )}

      <section className="w-full max-w-6xl section-card p-4 sm:p-5">
        <h1 className="section-title mb-4">Inspiration for your first order</h1>
        <div className="w-full relative">
          {showLeftCateButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 brand-gradient-bg text-white p-2 rounded-full shadow-(--shadow-md) z-10"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-3 sm:gap-4 pb-2"
            ref={cateScrollRef}
          >
            {categories.map((cate, index) => (
              <CategoryCard
                name={cate.category}
                image={cate.image}
                key={index}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            ))}
          </div>
          {showRightCateButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 brand-gradient-bg text-white p-2 rounded-full shadow-(--shadow-md) z-10"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </section>

      <section className="w-full max-w-6xl section-card p-4 sm:p-5">
        <h1 className="section-title mb-4">
          Best shops in {currentCity || "your city"}
        </h1>
        <div className="w-full relative">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 brand-gradient-bg text-white p-2 rounded-full shadow-(--shadow-md) z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-3 sm:gap-4 pb-2"
            ref={shopScrollRef}
          >
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard
                name={shop.name}
                image={shop.image}
                key={index}
                onClick={() => navigate(`/shop/${shop._id}`)}
              />
            ))}
          </div>
          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 brand-gradient-bg text-white p-2 rounded-full shadow-(--shadow-md) z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </section>

      <section className="w-full max-w-6xl section-card p-5 sm:p-6 mb-4">
        <h1 className="section-title mb-4">Suggested Food Items</h1>
        <div className="w-full h-auto flex flex-wrap gap-5 justify-center">
          {updatedItemsList?.map((item, index) => (
            <FoodCard key={index} data={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default UserDashboard;
