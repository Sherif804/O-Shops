const app = require("express").Router();
const { addAdmin, adminSignIn, updateAdmin, deleteAdmin, getAllAdmins, getCurrentAdmin, getAdminById } = require('../controller/admins.controller');
const validator = require('../../../validation/common.validation');
const { addAdminValidation, updateAdminValidation, adminSignInValidation } = require("../validation/admins.validation");
const isAuthorized = require("../../../config/isAuthorized");
const { ADD_ADMIN, UPDATE_ADMIN, DELETE_ADMIN, GET_ALL_ADMIN, GET_CURRENT_ADMIN, GET_ADMIN_BY_ID } = require("../../../endPoints/endPoints");

app.post("/addAdmin", [validator(addAdminValidation)], addAdmin);
app.post("/adminSignIn", [validator(adminSignInValidation)], adminSignIn);
app.put("/updateAdmin/:id", [isAuthorized(UPDATE_ADMIN), validator(updateAdminValidation)], updateAdmin);
app.delete("/deleteAdmin/:id", [isAuthorized(DELETE_ADMIN)], deleteAdmin);
app.get("/getAllAdmins", isAuthorized(GET_ALL_ADMIN), getAllAdmins);
app.get("/getCurrentAdmin", isAuthorized(GET_CURRENT_ADMIN), getCurrentAdmin);
app.get("/getAdminById/:id", isAuthorized(GET_ADMIN_BY_ID), getAdminById);

module.exports = app;