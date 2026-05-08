const cartModel = require("../models/cart.model");
const cartService = require("../services/cart.service");

// Add To Cart
module.exports.AddToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`Add to Cart for user: ${userId}`);
    
    // Support both wrapped {item: {...}} and direct {...} body for Postman convenience
    const item = req.body.item || req.body;

    if (!item || !item.productId) {
      return res.status(400).json({ message: "Product details required (productId is missing)" });
    }

    const cart = await cartService.addToCart({ userId, item });

    return res
      .status(200)
      .json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error("AddToCart error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Get Cart
module.exports.GetCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await cartService.GetCart(userId);

    if (!cart) {
      return res.status(200).json({ 
        message: "Cart is empty", 
        cart: { items: [] } 
      });
    }

    return res
      .status(200)
      .json({ message: "Cart Data Fetch Successfully", cart });
  } catch (error) {
    console.error("GetCart error:", error);
    return res.status(500).json({ 
      message: "Error fetching cart", 
      error: error.message 
    });
  }
};

// Update quantity
module.exports.UpdateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { quantity } = req.body;

    const cart = await cartService.UpdateQuantity({ userId, productId, quantity });
    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Remove single item from cart
module.exports.RemoveItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    await cartService.RemoveSingleProduct({ userId, productId });

    return res
      .status(200)
      .json({ message: "Remove Item from Cart Sucessfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
