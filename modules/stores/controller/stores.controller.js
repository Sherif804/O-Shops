const Store = require("../model/stores.model");
const User = require("../../users/model/users.model");
const Category = require("../../categories/model/categories.model");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/stores");

const addStore = async (req, res) => {
    const { storeName, telephoneNumber, website, storeCategories, storeLogoURL } = req.body;
    try {
        if (storeLogoURL) {
            const store = await Store.findOne({ storeName: storeName });
            if (store) {
                res.json({ status: 400, message: "This store already exists" })
            }
            else {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const buffer = Buffer.from(storeLogoURL.data, "base64");
                fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + storeLogoURL.name), buffer);
                let newStore = new Store({
                    storeName, telephoneNumber, website, storeCategories,
                    storeLogoURL: path.join('uploads/stores', uniqueSuffix + '-' + storeLogoURL.name)
                });
                await newStore.save();
                res.send({ status: 200, message: "Success" });
            }
        }
        else {
            res.json({ status: 400, message: "You have to enter store image" })
        }
    } catch (error) {
        console.log(error);

        res.json({ status: 500, message: "Something went wrong" })
    }
}

const updateStore = async (req, res) => {
    const { storeName, telephoneNumber, website, storeCategories, storeLogoURL } = req.body;
    const { id } = req.params;

    // console.log(storeName)
    const storeNameTaken = await Store.findOne({ storeName });
    const store = await Store.findById({ _id: id }).catch(error => { return });
    if (!store) {
        res.json({ status: 400, message: "Please enter a valid id" })
    }
    else if (storeNameTaken && storeName != store.storeName) {
        res.json({ status: 400, message: "This store already exists" })
    }
    else if (!store && storeNameTaken) {
        res.json({ status: 400, message: "Please enter a valid id" })
    }
    else {
        if (storeLogoURL) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const buffer = Buffer.from(storeLogoURL.data, "base64");
            fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + storeLogoURL.name), buffer);
            await Store.findByIdAndUpdate({ _id: id }, {
                storeName, telephoneNumber, website, storeCategories,
                storeLogoURL: path.join('uploads/stores', uniqueSuffix + '-' + storeLogoURL.name)
            })
                .then(re => {
                    res.send({ status: 200, message: "Success" });
                })
                .catch(error => {
                    if (error.name == "CastError") {
                        res.json({ status: 400, message: "Please enter a valid id" })
                    }
                    else {
                        res.json({ status: 500, message: "Something went wrong" })
                    }
                })
        }
        else if (!storeLogoURL) {
            await Store.findByIdAndUpdate({ _id: id }, {
                storeName, telephoneNumber, website, storeCategories,
                storeLogoURL: store.storeLogoURL
            })
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
}

const deleteStore = async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById({ _id: id }).catch(error => error => { return });
    if (!store) {
        res.json({ status: 400, message: "Please enter a valid id" })
    }
    else {
        fs.unlinkSync(store.storeLogoURL);
        await Store.findByIdAndDelete({ _id: id })
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

const getAllStores = async (req, res) => {
    let { page, size } = req.query;
    if (!page) {
        page = 1
    }
    if (!size) {
        size = 10
    }
    const limit = parseInt(size);
    const skip = (page - 1) * limit;
    try {
        const allStores = await Store.find({}).select("-storeCategories").limit(limit).skip(skip);
        const totalRes = await Store.count();
        const totalPages = Math.ceil(totalRes / limit);
        res.send({ status: 200, message: "Success", totalRes, totalPages, allStores });
    } catch (error) {
        res.json({ status: 500, message: "Something went wrong" })
    }
}

const getStoreCategories = async (req, res) => {
    let { page, size } = req.query;
    let { id } = req.params;
    const storeFound = await Store.find({ _id: id }).catch(error => { return });
    if (storeFound) {
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 10
        }
        const limit = parseInt(size);
        const skip = (page - 1) * limit;
        try {
            const allStoreCategories = await Store.find({ _id: id }).select("storeCategories").populate('storeCategories').limit(limit).skip(skip);
            const storeCategories = allStoreCategories[0].storeCategories;
            const totalRes = await storeCategories.length;
            const totalPages = Math.ceil(totalRes / limit);
            res.send({ status: 200, message: "Success", totalRes, totalPages, storeCategories });
        } catch (error) {
            res.json({ status: 500, message: "Something went wrong" })
        }
    }
    else {
        res.json({ status: 400, message: "Please enter a valid id" });
    }
}

const getStoreById = async (req, res) => {
    let { id } = req.params;
    const storeFound = await Store.find({ _id: id }).catch(error => { return });
    if (storeFound) {
        try {
            const store = await Store.find({ _id: id }).populate('storeCategories');
            res.send({ status: 200, message: "Success", store });
        } catch (error) {
            res.json({ status: 500, message: "Something went wrong" + error })
        }
    }
    else {
        res.json({ status: 400, message: "Please enter a valid id" })
    }
}

const recentStores = async (req, res) => {
    try {
        const allStoresCount = await Store.count();
        if (allStoresCount > 0) {
            const recentStores = await Store.find({}).limit(5).skip(allStoresCount - 5);
            res.send({ status: 200, message: "Success", recentStores });
        } else {
            res.send({ status: 200, message: "There is no stores yet!" });
        }
    } catch (error) {

        res.json({ status: 500, message: "Something went wrong" })
    }
}

const countUsersCategoriesStores = async (req, res) => {
    try {
        const allStoresCount = await Store.count();
        const allUersCount = await User.count();
        const allCategoriesCount = await Category.count();
        res.send({ status: 200, message: "Success", allStoresCount, allUersCount, allCategoriesCount });
    } catch (error) {
        res.json({ status: 500, message: "Something went wrong" })
    }
}

module.exports = {
    addStore,
    updateStore,
    deleteStore,
    getAllStores,
    getStoreCategories,
    getStoreById,
    recentStores,
    countUsersCategoriesStores
}