const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const cartController = require("../../../controllers/cart.controller");

// add items
router.post("/add", userMiddleware.authUser, cartController.AddToCart);

// get all items
router.get("/all", userMiddleware.authUser, cartController.GetCart);

// remove single item from cart
router.delete("/product/:id", userMiddleware.authUser, cartController.RemoveItem);

// update single item quantity from cart
router.put("/update/:id", userMiddleware.authUser, cartController.UpdateCart);

module.exports = router;
