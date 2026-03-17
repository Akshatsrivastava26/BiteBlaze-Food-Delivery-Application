import express from "express";
import { placeOrder, getMyOrders, updateOrderStatus } from "../controllers/order.controllers.js";

import isAuth from "../middleware/isAuth.js";


const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.get("/my-orders", isAuth, getMyOrders);
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);
export default orderRouter;