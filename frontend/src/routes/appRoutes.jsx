import { lazy } from "react";

const SignUp = lazy(() => import("../pages/SignUp"));
const SignIn = lazy(() => import("../pages/SignIn"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));

const Home = lazy(() => import("../pages/Home"));
const CreateEditShop = lazy(() => import("../pages/CreateEditShop"));
const AddItem = lazy(() => import("../pages/AddItem"));
const EditItem = lazy(() => import("../pages/EditItem"));
const CartPage = lazy(() => import("../pages/CartPage"));
const CheckOut = lazy(() => import("../pages/CheckOut"));
const OrderPlaced = lazy(() => import("../pages/OrderPlaced"));
const MyOrders = lazy(() => import("../pages/MyOrders"));
const TrackOrderPage = lazy(() => import("../pages/TrackOrderPage"));
const Shop = lazy(() => import("../pages/Shop"));

export const publicRoutes = [
  { path: "/signup", component: SignUp },
  { path: "/signin", component: SignIn },
  { path: "/forgot-password", component: ForgotPassword },
];

export const protectedRoutes = [
  { path: "/", component: Home },
  { path: "/create-edit-shop", component: CreateEditShop },
  { path: "/add-item", component: AddItem },
  { path: "/edit-item/:itemId", component: EditItem },
  { path: "/cart", component: CartPage },
  { path: "/checkout", component: CheckOut },
  { path: "/order-placed", component: OrderPlaced },
  { path: "/my-orders", component: MyOrders },
  { path: "/track-order/:orderId", component: TrackOrderPage },
  { path: "/shop/:shopId", component: Shop },
];
