const Wishlist = require("../model/wishlist.model");

const addProductToWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;
    const wishlistUser = await Wishlist.findOne({ user: userId }).catch(error => { return });
    if (wishlistUser) {
        const userProducts = wishlistUser.products;
        if (userProducts.indexOf(productId) == -1) {
            await userProducts.push(productId);
            await Wishlist.findOneAndUpdate({ user: userId }, { products: userProducts })
                .then(re => res.send({ status: 200, message: "Success" }))
                .catch(error => res.json({ status: 500, message: "Something went wrong" }))
        }
        else {
            res.send({ status: 400, message: "This product already in your wishlist" })
        }
    }
    else {
        let newWishlist = new Wishlist({ user: userId, products: productId });
        await newWishlist.save()
            .then(re => res.send({ status: 200, message: "Success" }))
            .catch(error => res.json({ status: 500, message: "Something went wrong" }))
    }

}

const removeProductFromWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;
    const wishlistUser = await Wishlist.findOne({ user: userId }).catch(error => { return });
    if (wishlistUser) {
        const userProducts = wishlistUser.products;
        const productIndex = await userProducts.indexOf(productId);
        if (productIndex != -1) {
            await userProducts.splice(productIndex, 1);
            await Wishlist.findOneAndUpdate({ user: userId }, { products: userProducts })
                .then(async re => {
                    if(userProducts.length == 0){
                        await Wishlist.findOneAndDelete({ user: userId })
                    }
                    res.send({ status: 200, message: "Success" })
                })
                .catch(error => res.json({ status: 500, message: "Something went wrong" }))
        }
        else {
            res.send({ status: 400, message: "This product doesn't exist in your wishlist" })
        }
    }
    else {
        res.send({ status: 400, message: "This user doesn't have a wishlist" })
    }

}

const getUserWishlist = async (req, res) => {
    const userId = req.user._id;
    const wishlistUser = await Wishlist.findOne({ user: userId }).catch(error => { return });
    if (wishlistUser) {
        try {
            const userWishlist = await Wishlist.find({ user: userId }).populate("products");
            const wishList = userWishlist[0].products
            res.status(200).send({ message: "Success", wishList });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" })
        }
    }
    else {
        res.send({ status: 400, message: "This user doesn't have a wishlist" })
    }

}

module.exports = {
    addProductToWishlist,
    removeProductFromWishlist,
    getUserWishlist
}