const mongoose = require("mongoose");
const wishlistSchema = require("../schema/wishlist.schema");

const wishlistModel = mongoose.model("wishlist", wishlistSchema);

module.exports = wishlistModel;