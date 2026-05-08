const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const orderController = require("../../../controllers/order.controller");

// Place new order
router.post("/place", userMiddleware.authUser, orderController.PlaceOrder);

// Get my orders
router.get("/my-orders", userMiddleware.authUser, orderController.MyOrders);

// Get single order details
router.get("/:id", userMiddleware.authUser, orderController.OrderDetails);

module.exports = router;