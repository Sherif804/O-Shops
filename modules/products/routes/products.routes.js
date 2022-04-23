const app = require("express").Router();
const { addProduct, updateProduct, deleteProduct, getAllProducts, getProductById, topRatedProducts, storeTopRatedProducts, 
    storeProducts, productsByStoreAndCategory, productSearch } = require("../controller/products.controller");

const validator = require('../../../validation/common.validation');

const { addProductValidation, updateProductValidation } = require("../validation/products.validation");
const isAuthorized = require("../../../config/isAuthorized");
const { ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT, GET_ALL_PRODUCT, GET_PRODUCT_BY_ID, TOP_RATED_PRODUCTS, STORE_TOP_RATED_PRODUCTS,
    PRODUCT_BY_STORE_AND_CATEGORY, STORE_PRODUCTS, PRODUCT_SEARCH} = require("../../../endPoints/endPoints");

app.post("/addProduct", [isAuthorized(ADD_PRODUCT),validator(addProductValidation)], addProduct);
app.put("/updateProduct/:id", [isAuthorized(UPDATE_PRODUCT), validator(updateProductValidation)], updateProduct);
app.delete("/deleteProduct/:id", [isAuthorized(DELETE_PRODUCT)], deleteProduct);
app.get("/getAllProducts", [isAuthorized(GET_ALL_PRODUCT)], getAllProducts);
app.get("/getProductById/:id", [isAuthorized(GET_PRODUCT_BY_ID)], getProductById);

app.get("/topRatedProducts", [isAuthorized(TOP_RATED_PRODUCTS)], topRatedProducts);
app.get("/storeTopRatedProducts/:storeId", [isAuthorized(STORE_TOP_RATED_PRODUCTS)], storeTopRatedProducts);
app.get("/storeProducts/:storeId", [isAuthorized(STORE_PRODUCTS)], storeProducts);
app.get("/productsByStoreAndCategory/:storeId/:categoryId", [isAuthorized(PRODUCT_BY_STORE_AND_CATEGORY)], productsByStoreAndCategory);
app.get("/productSearch", [isAuthorized(PRODUCT_SEARCH)], productSearch);

module.exports = app;