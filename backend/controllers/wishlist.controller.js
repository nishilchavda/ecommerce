const wishlistService = require("../services/wishlist.service");

// add item to wishlist
module.exports.AddToWishlist = async(req, res) =>{
    try {
        const userId = req.user.id;
        const item = req.body.item || req.body;

        if (!item || !item.productId) {
            return res.status(400).json({ message: "productId is required" });
        }

        const wishlist = await wishlistService.AddToWishlist({userId, item});

        if(!wishlist){
            return res.status(404).json({message: "Product Not Found !!"})
        }

        return res.status(200).json({message: "Add Item into Wishlist", wishlist})
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// get wishlist
module.exports.GetWishlist = async(req, res) =>{
    try {
        const userId = req.user.id;
        const wishlist = await wishlistService.GetWishlist(userId);
        return res.status(200).json({wishlist: wishlist || {productIds: []}})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// remove item from wishlist
module.exports.RemoveFromWishlist = async(req, res) =>{
    try {
        const userId = req.user.id;
        const { id } = req.params; // Matches the route param '/:id'
        const wishlist = await wishlistService.RemoveFromWishlist({userId, itemId: id});
        return res.status(200).json({message: "Item removed from Wishlist", wishlist})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}