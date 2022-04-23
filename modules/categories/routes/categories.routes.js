const app = require("express").Router();
const { addCategory, updateCategory, deleteCategory, getAllCategories, recentCategories, getCategoryById } = require("../controller/categories.controller");
const validator = require('../../../validation/common.validation');
const { addCategoryValidation, updateCategoryValidation } = require("../validation/categories.validation");
const isAuthorized = require("../../../config/isAuthorized");
const { ADD_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY, GET_ALL_CATEGORY, RECENT_CATEGORIES, GET_CATEGORY_BY_ID } = require("../../../endPoints/endPoints");


app.post("/addCategory", [isAuthorized(ADD_CATEGORY),validator(addCategoryValidation)], addCategory);
app.put("/updateCategory/:id", [isAuthorized(UPDATE_CATEGORY), validator(updateCategoryValidation)], updateCategory);
app.delete("/deleteCategory/:id", [isAuthorized(DELETE_CATEGORY)], deleteCategory);
app.get("/getAllCategories", [isAuthorized(GET_ALL_CATEGORY)], getAllCategories);
app.get("/recentCategories", [isAuthorized(RECENT_CATEGORIES)], recentCategories);
app.get("/getCategoryById/:id", [isAuthorized(GET_CATEGORY_BY_ID)], getCategoryById);

module.exports = app;