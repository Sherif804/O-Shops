const Admin = require("../model/admins.model");
const bcrypt = require("bcrypt");
const saltRounds = 5;
const jwt = require("jsonwebtoken");

const addAdmin = async (req, res) => {
    const { firstName, lastName, userName, password, role } = req.body;
    try {
        const admin = await Admin.findOne({ userName });
        if (admin) {
            res.json({ status: 400, message: "This username is already taken" })
        }
        
        else {
            let newAdmin = new Admin({ firstName, lastName, userName, password, role });
            await newAdmin.save();
            res.send({ status: 200, message: "Success" });
        }

    } catch (error) {
        res.json({ status: 500, message: "Something went wrong" })
    }
}

const adminSignIn = async (req, res) => {
    const { userName, password } = req.body;
    try {
        let admin = await Admin.findOne({ userName });
        if (!admin) {
            res.json({ status: 400, message: "Please enter a valid username" });
        }
        else {
            let match = await bcrypt.compare(password, admin.password);
            if (match) {
                let token = jwt.sign({ _id: admin._id, role: admin.role }, process.env.SECRET_KEY);
                res.json({ status: 200, message: "Success", token: token });
            }
            else {
                res.json({ status: 422, message: "This password is invalid" })
            }
        }
    } catch (error) {
        res.json({ status: 500, message: "Something went wrong"  + error})
    }
}

const updateAdmin = async (req, res) => {
    const { firstName, lastName, userName, password, role } = req.body;
    const { id } = req.params;
    let hashedPassword;
    const user = await Admin.findById({ _id: id }).catch(error => { return });
    console.log(user.password);
    if (password) {
        hashedPassword = await bcrypt.hash(password, saltRounds);
    }
    else {
        hashedPassword = user.password;
    }
    const userNameTaken = await Admin.findOne({ userName });
    const admin = await Admin.findById({ _id: id }).catch(error => { return });
    if (!admin) {
        res.json({ status: 400, message: "Please enter a valid id" })
    }
    else if (userNameTaken && userName != user.userName) {
        res.json({ status: 400, message: "This username is already taken" })
    }
    else if (!admin && userNameTaken) {
        res.json({ status: 400, message: "Please enter a valid id" })
    }
    else {
        await Admin.findByIdAndUpdate({ _id: id }, { firstName, lastName, userName, password: hashedPassword, role })
            .then(re => res.send({ status: 200, message: "Success" }))
            .catch(error => {
                if (error.name == "CastError") {
                    res.json({ status: 400, message: "Please enter a valid id" })
                }
                else {
                    res.json({ status: 500, message: "Something went wrong" })
                }
            })
    }
}

const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    const admin = await Admin.findById({ _id: id }).catch(error => { return });
    if (!admin) {
        res.json({ status: 400, message: "Please enter a valid id" })
    }
    else {
        await Admin.findByIdAndDelete({ _id: id })
            .then(re => res.send({ status: 200, message: "Success" }))
            .catch(error => {
                if (error.name == "CastError") {
                    res.json({ status: 400, message: "Please enter a valid id" })
                }
                else {
                    res.json({ status: 500, message: "Something went wrong" })
                }
            })
    }
}

const getAllAdmins = async (req, res) => {
    let { page, size } = req.query;
    if (!page) {
        page = 1
    }
    if (!size) {
        size = 25
    }
    const limit = parseInt(size);
    const skip = (page - 1) * limit;
    try {
        const allAdmins = await Admin.find({}).select("-password").limit(limit).skip(skip);
        const totalRes = await Admin.count();
        const totalPages = Math.ceil(totalRes / limit);
        res.send({ status: 200, message: "Success", totalRes, totalPages, allAdmins });
    } catch (error) {
        res.json({ status: 500, message: "Something went wrong" })
    }
}

const getAdminById = async (req, res) => {
    try {
        let { id } = req.params;
        const admin = await Admin.findOne({ _id: id }).select("-password");
        res.send({ status: 200, message: "Success", admin });
    } catch (error) {
        res.json({ status: 500, message: "Something went wrong" })
    }
}


const getCurrentAdmin = async (req, res) => {
    const userId = req.user._id;
    await Admin.findOne({ _id: userId }).select("-password")
        .then(userData => res.status(200).send({ message: "Success", userData }))
        .catch(error => res.status(500).json({ message: "Something went wrong" }))
}

module.exports = {
    addAdmin,
    adminSignIn,
    updateAdmin,
    deleteAdmin,
    getAllAdmins,
    getAdminById,
    getCurrentAdmin
}
