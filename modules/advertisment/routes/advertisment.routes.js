const app = require("express").Router();
const {  addAdvertisment,updateAdvertisment,deleteAdvertisment,getAllAdvertisments,getAdvertismentById,getAllActiveAdvertisments } = require("../controller/advertisment.controller");
const validator = require('../../../validation/common.validation');
const { addAdvertismentValidation, updateAdvertismentValidation } = require("../validation/advertisment.validation");
const isAuthorized = require("../../../config/isAuthorized");
const { ADD_ADVERTISMENT,UPDATE_ADVERTISMENT,DELETE_ADVERTISMENT,GET_ALL_ADVERTISMENTS,GET_ALL_ACTIVE_ADVERTISMENTS,GET_ADVERTISMENTS_BY_ID, } = require("../../../endPoints/endPoints");


app.post("/addAdvertisment", [isAuthorized(ADD_ADVERTISMENT),validator(addAdvertismentValidation)], addAdvertisment);
app.put("/updateAdvertisment/:id", [isAuthorized(UPDATE_ADVERTISMENT), validator(updateAdvertismentValidation)], updateAdvertisment);
app.delete("/deleteAdvertisment/:id", [isAuthorized(DELETE_ADVERTISMENT)], deleteAdvertisment);
app.get("/getAllAdvertisments", [isAuthorized(GET_ALL_ADVERTISMENTS)], getAllAdvertisments);
app.get("/getAllActiveAdvertisments", [isAuthorized(GET_ALL_ACTIVE_ADVERTISMENTS)], getAllActiveAdvertisments);
app.get("/getAdvertismentById/:id", [isAuthorized(GET_ADVERTISMENTS_BY_ID)], getAdvertismentById);

module.exports = app;