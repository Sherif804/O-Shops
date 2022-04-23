const app = require("express").Router();
const { addProductToWishlist, removeProductFromWishlist, getUserWishlist } = require("../controller/wishlist.controller");
const validator = require('../../../validation/common.validation');
const { addWishlistValidation, removeProductFromWishlistValidaton } = require("../validation/wishlist.validation");
const isAuthorized = require("../../../config/isAuthorized");
const { ADD_PRODUCT_TO_WISHLIST, DELETE_PRODUCT_FROM_WISHLIST, GET_USER_WISHLIST } = require("../../../endPoints/endPoints");

app.post("/addProductToWishlist", [isAuthorized(ADD_PRODUCT_TO_WISHLIST), validator(addWishlistValidation)], addProductToWishlist);
app.delete("/removeProductFromWishlist", [isAuthorized(DELETE_PRODUCT_FROM_WISHLIST), validator(removeProductFromWishlistValidaton)], removeProductFromWishlist);
app.get("/getUserWishlist", [isAuthorized(GET_USER_WISHLIST)], getUserWishlist);


module.exports = app;