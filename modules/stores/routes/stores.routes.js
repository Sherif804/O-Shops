const app = require("express").Router();
const { addStore, updateStore, deleteStore, getAllStores, getStoreCategories, getStoreById, recentStores, countUsersCategoriesStores } = require("../controller/stores.controller");
const validator = require('../../../validation/common.validation');
const { addStoreValidation, updateStoreValidation } = require("../validation/stores.validation");
const isAuthorized = require("../../../config/isAuthorized");
const { ADD_STORE, UPDATE_STORE, DELETE_STORE, GET_ALL_STORE, GET_STORE_CATEGORIES, GET_STORE_BY_ID, RECENT_STORES, COUNT_USERS_CATEGORIES_STORES }
    = require("../../../endPoints/endPoints");

app.post("/addStore", [isAuthorized(ADD_STORE), validator(addStoreValidation)], addStore);
app.put("/updateStore/:id", [isAuthorized(UPDATE_STORE), validator(updateStoreValidation)], updateStore);
app.delete("/deleteStore/:id", [isAuthorized(DELETE_STORE)], deleteStore);
app.get("/getAllStores", [isAuthorized(GET_ALL_STORE)], getAllStores);
app.get("/getStoreCategories/:id", [isAuthorized(GET_STORE_CATEGORIES)], getStoreCategories);
app.get("/getStoreById/:id", [isAuthorized(GET_STORE_BY_ID)], getStoreById);
app.get("/recentStores", [isAuthorized(RECENT_STORES)], recentStores);
app.get("/countUsersCategoriesStores", [isAuthorized(COUNT_USERS_CATEGORIES_STORES)], countUsersCategoriesStores);

module.exports = app;