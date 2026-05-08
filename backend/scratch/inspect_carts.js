const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cartModel = require('../models/cart.model');
const userModel = require('../models/user.model');
const productModel = require('../models/product.model');

async function inspectCarts() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const carts = await cartModel.find({});
    console.log(`Found ${carts.length} carts`);
    carts.forEach((cart, index) => {
      console.log(`Cart ${index}: User ${cart.userId}`);
      cart.items.forEach((item, i) => {
        console.log(`  Item ${i}: ProductID ${item.productId}, Quantity ${item.quantity}`);
      });
    });
    process.exit(0);
  } catch (err) {
    console.error('Inspection failed:', err);
    process.exit(1);
  }
}

inspectCarts();
