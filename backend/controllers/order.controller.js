const orderService = require("../services/order.service");

module.exports.PlaceOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const order = await orderService.createOrder({ 
      userId, 
      shippingAddress, 
      paymentMethod 
    });

    return res.status(201).json({ 
      message: "Order placed successfully", 
      order 
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.MyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getUserOrders(userId);
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.OrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
