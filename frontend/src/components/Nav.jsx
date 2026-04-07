import React, { useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../config/env";
import axios from "axios";
import { useState } from "react";
import { clearUserSession, setSearchItems } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa6";
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { setMyShopData } from "../redux/ownerSlice";
import { logger } from "../utils/logger";
import BrandButton from "./ui/BrandButton";

function Nav() {
  const { userData, currentCity, cartItems, myOrders } =
    useSelector((state) => state.user) || {};
  const user = userData?.user;
  const { myShopData } = useSelector((state) => state.owner) || {};
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowInfo(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleOpenMyOrders = () => {
    navigate("/my-orders");
    setShowInfo(false);
  };

  const handleLogOut = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/signout`,
        {},
        {
          withCredentials: true,
        },
      );
      dispatch(clearUserSession());
      dispatch(setMyShopData(null));
      navigate("/signin");
    } catch (error) {
      logger.error("Logout failed", error);
    }
  };

  const handleSearchItems = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`,
        { withCredentials: true },
      );
      dispatch(setSearchItems(result.data));
    } catch (error) {
      logger.error("Search failed", error);
    }
  };

  useEffect(() => {
    if (query) {
      handleSearchItems();
    } else {
      dispatch(setSearchItems(null));
    }
  }, [query]);

  return (
    <header className="w-full h-20 flex items-center justify-between md:justify-center gap-6 px-4 sm:px-5 fixed top-0 z-50 overflow-visible border-b border-(--border-soft) bg-(--bg-elevated)/70 backdrop-blur-xl">
      {showSearch && user?.role == "user" && (
        <div className="w-[92%] h-[66px] section-card items-center gap-4 flex fixed top-20 left-[4%] md:hidden px-3">
          <div className="flex items-center w-[34%] overflow-hidden gap-2 px-2 border-r border-(--border-soft)">
            <FaLocationDot size={18} className="text-(--brand-2)" />
            <div className="w-[80%] truncate text-(--text-secondary) text-sm">
              {currentCity || "Your city"}
            </div>
          </div>
          <div className="w-[66%] flex items-center gap-2">
            <IoIosSearch size={20} className="text-(--brand-2)" />
            <input
              type="text"
              placeholder="Search dishes, shops..."
              className="px-2 text-(--text-secondary) outline-0 w-full bg-transparent text-sm"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}
      <h1 className="text-3xl font-extrabold m-1 brand-gradient-text whitespace-nowrap tracking-tight">
        BiteBlaze
      </h1>

      {user?.role == "user" && (
        <div className="md:w-[60%] lg:w-[44%] h-[62px] section-card items-center gap-4 hidden md:flex px-3">
          <div className="flex items-center w-[32%] overflow-hidden gap-2 px-2 border-r border-(--border-soft)">
            <FaLocationDot size={18} className="text-(--brand-2)" />
            <div className="w-[80%] truncate text-(--text-secondary) text-sm">
              {currentCity || "Your city"}
            </div>
          </div>
          <div className="w-[68%] flex items-center gap-2">
            <IoIosSearch size={20} className="text-(--brand-2)" />
            <input
              type="text"
              placeholder="Search dishes, shops..."
              className="px-2 text-(--text-secondary) outline-0 w-full bg-transparent"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 min-w-[120px]">
        {user?.role == "user" &&
          (showSearch ? (
            <RxCross2
              size={23}
              className="text-(--brand-2) md:hidden"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <IoIosSearch
              size={23}
              className="text-(--brand-2) md:hidden"
              onClick={() => setShowSearch(true)}
            />
          ))}

        {user?.role == "owner" ? (
          <>
            {myShopData && (
              <>
                <button
                  className="hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-(--bg-subtle) text-(--brand-2)"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={20} />
                  <span>Add Food Item</span>
                </button>

                <button
                  className="md:hidden flex items-center p-2 cursor-pointer rounded-full bg-(--bg-subtle) text-(--brand-2)"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={20} />
                </button>
              </>
            )}

            {/* My Orders Icone */}
            <div
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-(--bg-subtle) text-(--brand-2) font-medium"
              onClick={handleOpenMyOrders}
            >
              <TbReceipt2 size={20} />
              <span>My Orders</span>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white brand-gradient-bg rounded-full px-1.5 py-px">
                {myOrders?.length || 0}
              </span>
            </div>
            <div
              className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-(--bg-subtle) text-(--brand-2) font-medium"
              onClick={handleOpenMyOrders}
            >
              <TbReceipt2 size={20} />
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white brand-gradient-bg rounded-full px-1.5 py-px">
                {myOrders?.length || 0}
              </span>
            </div>
          </>
        ) : user?.role == "user" ? (
          <>
            <div className="relative cursor-pointer">
              <FiShoppingCart
                size={25}
                className="text-(--brand-2)"
                onClick={() => navigate("/cart")}
              />
              <span className="absolute right-[-9px] -top-3 text-(--brand-2)">
                {cartItems?.length || 0}
              </span>
            </div>

            <button
              className="hidden md:block px-3 py-1 rounded-lg bg-(--bg-subtle) text-(--brand-2) text-sm font-medium cursor-pointer"
              onClick={handleOpenMyOrders}
            >
              My Orders
            </button>
          </>
        ) : null}

        <div ref={menuRef}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center brand-gradient-bg text-white text-[18px] shadow-(--shadow-md) font-semibold cursor-pointer"
            onClick={() => setShowInfo((prev) => !prev)}
          >
            {user?.fullName ? user.fullName.slice(0, 1) : "?"}
          </div>
          {showInfo && (
            <div className="fixed top-20 right-2.5 md:right-[10%] lg:right-[25%] w-[200px] section-card p-5 flex flex-col gap-2.5 z-50">
              <div className="text-[17px] font-semibold">{user?.fullName}</div>
              {(user?.role == "user" || user?.role == "owner") && (
                <div
                  className="md:hidden text-(--brand-2) font-semibold cursor-pointer"
                  onClick={handleOpenMyOrders}
                >
                  My Orders
                </div>
              )}

              <div
                className="text-(--brand-2) font-semibold cursor-pointer"
                onClick={handleLogOut}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Nav;
