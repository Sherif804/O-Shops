const Category = require("../model/categories.model");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/categories")

const addCategory = async (req, res) => {
    const { categoryName, categoryImageURL } = req.body;
    try {
        if (categoryImageURL) {
            const category = await Category.findOne({ categoryName: categoryName });
            if (category) {
                res.json({status:400, message: "This category already exists" })
            }
            else {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const buffer = Buffer.from(categoryImageURL.data, "base64");
                fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + categoryImageURL.name), buffer);
                let newCategory = new Category({ categoryName: categoryName, categoryImageURL: path.join('uploads/categories', uniqueSuffix + '-' + categoryImageURL.name) });
                await newCategory.save();
                res.send({status:200, message: "Success" });
            }
        }
        else {
            res.json({status:400, message: "You have to enter category image" })
        }
    } catch (error) {
        res.json({status:500, message: "Something went wrong" })
    }
}

const updateCategory = async (req, res) => {
    const { categoryName, categoryImageURL } = req.body;
    const { id } = req.params;
    const categoryNameTaken = await Category.findOne({ categoryName });
    const category = await Category.findById({ _id: id }).catch(error =>{ return });
    if (!category) {
        res.json({status:400, message: "Please enter a valid id" })
    }
    else if (categoryNameTaken && categoryName != category.categoryName) {
        res.json({status:400, message: "This category already exists" })
    }
    else if (!category && categoryNameTaken) {
        res.json({status:400, message: "Please enter a valid id" })
    }
    else {
        if (categoryImageURL) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const buffer = Buffer.from(categoryImageURL.data, "base64");
            fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + categoryImageURL.name), buffer);
            fs.unlinkSync(category.categoryImageURL);
            await Category.findByIdAndUpdate({ _id: id }, { categoryName, categoryImageURL: path.join('uploads/categories', uniqueSuffix + '-' + categoryImageURL.name) })
                .then(re => {
                    res.send({status:200, message: "Success" });
                }) 
                .catch(error => {
                    if (error.name == "CastError") {
                        res.json({status:400, message: "Please enter a valid id" })
                    }
                    else {
                        res.json({status:500, message: "Something went wrong" })
                    }
                })
        }
        else if(categoryName && !categoryImageURL) {
            await Category.findByIdAndUpdate({ _id: id }, {categoryName: categoryName, categoryImageURL: category.categoryImageURL })
                .then(re => res.send({status:200, message: "Success" }))
                .catch(error => {
                    if (error.name == "CastError") {
                        res.json({status:400, message: "Please enter a valid id" })
                    }
                    else {
                        res.json({status:500, message: "Something went wrong" })
                    }
                })
        }
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById({ _id: id }).catch(error => error =>{ return });
    if (!category) {
        res.json({status:400, message: "Please enter a valid id" })
    }
    else {
        fs.unlinkSync(category.categoryImageURL);
        await Category.findByIdAndDelete({ _id: id })
            .then(re => res.send({status:200, message: "Success" }))
            .catch(error => {
                if (error.name == "CastError") {
                    res.json({status:400, message: "Please enter a valid id" })
                }
                else {
                    res.json({status:500, message: "Something went wrong" })
                }
            })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({});
        res.send({status:200, message: "Success", allCategories });

    } catch (error) {
        res.json({status:500, message: "Something went wrong" })
    }
}

const getCategoryById = async (req, res) => {
    const {id} = req.params;
    try {
        const category = await Category.findOne({_id: id});
        res.send({status:200, message: "Success", category });
    } catch (error) {
        res.json({status:500, message: "Something went wrong" })
    }
}


const recentCategories = async (req, res) => {
    try {
        const allCategoriesCount = await Category.count();
        const recentCategories = await Category.find({}).limit(5).skip(allCategoriesCount-4);
        res.status(200).send({ message: "Success", recentCategories });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}


module.exports = {
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    recentCategories,
    getCategoryById
}
