const cartModel = require("../models/cart.model");

// add item to cart
module.exports.addToCart = async ({ userId, item }) => {
  let cart = await cartModel.findOne({ userId });

  if (!cart) {
    cart = new cartModel({ userId, items: [] });
  }

  // Sanitize quantity to add
  let quantityToAdd = parseInt(item.quantity);
  if (isNaN(quantityToAdd)) quantityToAdd = 1;
  
  item.quantity = quantityToAdd;

  // Check if product already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (i) => i.productId && i.productId.toString() === item.productId.toString()
  );

  if (existingItemIndex > -1) {
    // If it exists, update quantity
    let currentQty = parseInt(cart.items[existingItemIndex].quantity);
    if (isNaN(currentQty)) currentQty = 0; // Fix existing NaN if any
    
    cart.items[existingItemIndex].quantity = currentQty + quantityToAdd;
  } else {
    // Otherwise, push new item
    cart.items.push(item);
  }

  return await cart.save();
};

// get Cart
module.exports.GetCart = async (userId) => {
  return await cartModel.findOne({ userId }).populate("items.productId");
};

// Update quantity
module.exports.UpdateQuantity = async ({ userId, productId, quantity }) => {
  let cart = await cartModel.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const itemIndex = cart.items.findIndex(
    (i) => i.productId && i.productId.toString() === productId.toString()
  );

  if (itemIndex < 0) throw new Error("Item not found in cart");

  let sanitizedQty = parseInt(quantity);
  if (isNaN(sanitizedQty)) sanitizedQty = 1;
  
  cart.items[itemIndex].quantity = sanitizedQty;
  return await cart.save();
};

// delete single product from cart
module.exports.RemoveSingleProduct = async ({ userId, productId }) => {
  let cart = await cartModel.findOne({ userId });

  if (!cart) throw new Error("Cart Not Found !!");

  const itemIndex = cart.items.findIndex(
    (i) => i.productId && i.productId.toString() === productId.toString()
  );

  if (itemIndex < 0) {
    throw new Error("Item not found in cart");
  }

  cart.items.splice(itemIndex, 1);
  return await cart.save();
};
