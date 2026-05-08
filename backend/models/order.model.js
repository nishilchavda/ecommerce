const mongoose = require("mongoose");

let OrderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  items: [
    { 
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, 
      quantity: { type: Number, required: true }, 
      price: { type: Number, required: true }
    },
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    default: "COD"
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("order", OrderSchema);
