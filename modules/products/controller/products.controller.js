const Product = require("../model/products.model");
const Store = require("../../stores/model/stores.model");
const Category = require("../../categories/model/categories.model");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/products");

const addProduct = async (req, res) => {
    const { productName, productImageURL, price, rate, inStock, topProduct, storeId, categoryId } = req.body;
    try {
        if (productImageURL) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const buffer = Buffer.from(productImageURL.data, "base64");
            fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + productImageURL.name), buffer);
            let newProduct = new Product({
                productName, price, rate, inStock, topProduct, storeId, categoryId,
                productImageURL: path.join('uploads/products', uniqueSuffix + '-' + productImageURL.name)
            });
            await newProduct.save();
            res.send({ status: 200, message: "Success" });
        }
        else {
            res.json({ status: 400, message: "You have to enter product image" })
        }
    } catch (error) {
        res.json({ status: 500, message: "Something went wrong" + error })
    }
}

const updateProduct = async (req, res) => {
    const { productName, price, rate, inStock, topProduct, storeId, categoryId, productImageURL  } = req.body;
    const { id } = req.params;
    const product = await Product.findById({ _id: id }).catch(error => { return });
    if (!product) {
        res.json({ status: 400, message: "Please enter a valid id" })
    }
    else {
        if (productImageURL) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const buffer = Buffer.from(productImageURL.data, "base64");
            fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + productImageURL.name), buffer);
            await Product.findByIdAndUpdate({ _id: id },
                { productName, price, rate, inStock, topProduct, storeId, categoryId, productImageURL: path.join('uploads/products', uniqueSuffix + '-' + productImageURL.name) })
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
        else if (!productImageURL) {
            await Product.findByIdAndUpdate({ _id: id }, { productName, price, rate, inStock, topProduct, storeId, categoryId, productImageURL: product.productImageURL })
                .then(re => res.status(200).send({ status: 200, message: "Success" }))
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

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById({ _id: id }).catch(error => error => { return });
    if (!product) {
        res.json({ status: 400, message: "Please enter a valid id" })
    }
    else {
        let isUploaded = product.productImageURL.split("/")[0];
        if(isUploaded == "uploads")
            fs.unlinkSync(product.productImageURL);
        await Product.findByIdAndDelete({ _id: id })
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

const getAllProducts = async (req, res) => {
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
        const allProducts = await Product.find({}).limit(limit).skip(skip);
        const totalRes = await Product.count();
        const totalPages = Math.ceil(totalRes / limit);
        res.send({ status: 200, message: "Success", totalRes, totalPages, allProducts });
    } catch (error) {
        res.json({ status: 500, message: "Something went wrong" })
    }
}


const getProductById = async (req, res) => {
    let { id } = req.params;
    const productFound = await Product.find({ _id: id }).catch(error => { return });
    if (productFound) {
        try {
            const product = await Product.find({ _id: id });
            const productStoreName = await Store.find({ _id: product[0].storeId}).catch(error => { return });
            const productCategoryName = await Category.find({ _id: product[0].categoryId}).catch(error => { return });

            res.send({ status: 200, message: "Success", product, productStoreName, productCategoryName });
        } catch (error) {
            res.json({ status: 500, message: "Something went wrong" + error })
        }
    }
    else {
        res.json({ status: 400, message: "Please enter a valid id" })
    }
}


const topRatedProducts = async (req, res) => {
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
        const allProducts = await Product.find({ topProduct: true }).limit(limit).skip(skip);
        const totalRes = allProducts.length;
        const totalPages = Math.ceil(totalRes / limit);
        res.send({ status: 200, message: "Success", totalRes, totalPages, allProducts });
    } catch (error) {
        res.json({ status: 500, message: "Something went wrong" })
    }
}

const storeTopRatedProducts = async (req, res) => {
    let { page, size } = req.query;
    const { storeId } = req.params;
    const storeFound = await Store.find({ _id: storeId }).catch(error => { return });
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
            const allProducts = await Product.find({ topProduct: true, storeId }).limit(limit).skip(skip);
            const totalRes = allProducts.length;
            const totalPages = Math.ceil(totalRes / limit);
            res.send({ status: 200, message: "Success", totalRes, totalPages, allProducts });
        } catch (error) {
            res.json({ status: 500, message: "Something went wrong" })
        }
    }
    else {
        res.json({ status: 400, message: "Please enter a valid store id" })
    }

}

const storeProducts = async (req, res) => {
    let { page, size } = req.query;
    const { storeId } = req.params;
    const storeFound = await Store.find({ _id: storeId }).catch(error => { return });
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
            const allProducts = await Product.find({ storeId }).limit(limit).skip(skip);
            const totalRes = allProducts.length;
            const totalPages = Math.ceil(totalRes / limit);
            res.send({ status: 200, message: "Success", totalRes, totalPages, allProducts });
        } catch (error) {
            res.json({ status: 500, message: "Something went wrong" })
        }
    }
    else {
        res.json({ status: 400, message: "Please enter a valid store id" })
    }

}

const productsByStoreAndCategory = async (req, res) => {
    let { page, size } = req.query;
    const { storeId, categoryId } = req.params;
    const storeFound = await Store.find({ _id: storeId }).catch(error => { return });
    const categoryFound = await Category.find({ _id: categoryId }).catch(error => { return });
    if (!storeFound) {
        res.json({ status: 400, message: "Please enter a valid store id" })
    }
    else if (!categoryFound) {
        res.json({ status: 400, message: "Please enter a valid category id" })
    }
    else if (storeFound && categoryFound) {
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 10
        }
        const limit = parseInt(size);
        const skip = (page - 1) * limit;
        try {
            const allProducts = await Product.find({ status: 400, categoryId, storeId }).limit(limit).skip(skip);
            const totalRes = allProducts.length;
            const totalPages = Math.ceil(totalRes / limit);
            res.send({ status: 200, message: "Success", totalRes, totalPages, allProducts });
        } catch (error) {
            res.json({ status: 500, message: "Something went wrong" })
        }
    }
    else {
        res.json({ status: 500, message: "Something went wrong" })
    }
}

const productSearch = async (req, res) => {
    let { search } = req.query;
    try {
        const data = await Product.find({ productName: { $regex: search, $options: 'i' } }).limit(10).sort({ price : 1});
        res.send({ status: 200, message: "Success", data });
    } catch (error) {
        res.json({ status: 500, message: "Something went wrong" })
    }
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    topRatedProducts,
    storeTopRatedProducts,
    storeProducts,
    productsByStoreAndCategory,
    productSearch
}
