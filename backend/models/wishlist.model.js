const mongoose = require("mongoose");

const WishlistSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  productIds: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
      }
    },
  ],
});

module.exports = mongoose.model("wishlist", WishlistSchema)