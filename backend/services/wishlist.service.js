const wishlistModel = require("../models/wishlist.model")

// add items into wishlist
module.exports.AddToWishlist =async ({userId, item}) =>{

    let wishlist = await wishlistModel.findOne({userId});

    if(!wishlist) wishlist = new wishlistModel({userId, productIds: []})

    // Check if product already exists in wishlist to avoid duplicates
    const alreadyExists = wishlist.productIds.some(
        p => p.productId && p.productId.toString() === item.productId.toString()
    );

    if (!alreadyExists) {
        wishlist.productIds.push(item) // item is { productId: ... }
        return await wishlist.save();
    }
    
    return wishlist;
}

// get wishlist
module.exports.GetWishlist = async (userId) => {
    let wishlist = await wishlistModel.findOne({userId}).populate("productIds.productId");
    return wishlist;
}

// remove item from wishlist
module.exports.RemoveFromWishlist = async ({userId, itemId}) => {
    let wishlist = await wishlistModel.findOne({userId});
    if(!wishlist) throw new Error("Wishlist not found");
    
    // Filter by the entry ID (the _id of the object in the productIds array)
    wishlist.productIds = wishlist.productIds.filter(
        p => p._id.toString() !== itemId
    );
    return await wishlist.save();
}