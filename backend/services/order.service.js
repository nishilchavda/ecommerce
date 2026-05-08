const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");

module.exports.createOrder = async ({ userId, shippingAddress, paymentMethod }) => {
  // 1. Find the user's cart
  const cart = await cartModel.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 2. Calculate total amount
  let totalAmount = 0;
  const orderItems = cart.items.map(item => {
    // Note: In a real app, you'd fetch the product price from the DB here to ensure accuracy
    // Assuming prices are passed in or we can get them from populated cart
    const price = 100; // Placeholder if price isn't in cart items
    // If cart was populated, we'd use item.productId.price
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: price // You should ideally use populated prices
    };
  });

  // Calculate total (using a fallback since we don't have prices in cart model usually)
  // Let's assume the cart service already has some price logic or we populate it
  
  // Re-fetch cart with population to get real prices
  const populatedCart = await cartModel.findOne({ userId }).populate('items.productId');
  const itemsWithPrices = populatedCart.items.map(item => {
    if (!item.productId) throw new Error("Product in cart no longer exists");
    const itemTotal = item.productId.price * item.quantity;
    totalAmount += itemTotal;
    return {
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price
    };
  });

  // 3. Create the order
  const order = new orderModel({
    userId,
    items: itemsWithPrices,
    totalAmount,
    shippingAddress,
    paymentMethod,
    status: 'pending'
  });

  await order.save();

  // 4. Clear the cart
  cart.items = [];
  await cart.save();

  return order;
};

module.exports.getUserOrders = async (userId) => {
  return await orderModel.find({ userId }).sort({ createdAt: -1 }).populate('items.productId');
};

module.exports.getOrderById = async (orderId) => {
  return await orderModel.findById(orderId).populate('items.productId');
};