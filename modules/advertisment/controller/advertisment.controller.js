const Advertisment = require("../model/advertisment.model");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/advertisment")

const addAdvertisment = async (req, res) => {
    const { title, advertismentImageURL, isActive } = req.body;
    try {
        if (advertismentImageURL) {
            const advertisment = await Advertisment.findOne({ title: title });
            if (advertisment) {
                res.json({status:400, message: "This advertisment already exists" })
            }
            else {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const buffer = Buffer.from(advertismentImageURL.data, "base64");
                fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + advertismentImageURL.name), buffer);
                let newAdvertisment = new Advertisment({ title: title, advertismentImageURL: path.join('uploads/advertisment', uniqueSuffix + '-' + advertismentImageURL.name), isActive: isActive });
                await newAdvertisment.save();
                res.send({status:200, message: "Success" });
            }
        }
        else {
            res.json({status:400, message: "You have to enter advertisment image" })
        }
    } catch (error) {
        res.json({status:500, message: "Something went wrong"});
    }
}

const updateAdvertisment = async (req, res) => {
    const { title, advertismentImageURL, isActive } = req.body;
    const { id } = req.params;
    const titleTaken = await Advertisment.findOne({ title });
    const advertisment = await Advertisment.findById({ _id: id }).catch(error =>{ return });
    if (!advertisment) {
        res.json({status:400, message: "Please enter a valid id" })
    }
    else if (titleTaken && advertisment != advertisment.title) {
        res.json({status:400, message: "This advertisment already exists" })
    }
    else if (!advertisment && titleTaken) {
        res.json({status:400, message: "Please enter a valid id" })
    }
    else {
        if (advertismentImageURL) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const buffer = Buffer.from(advertismentImageURL.data, "base64");
            fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + advertismentImageURL.name), buffer);
            fs.unlinkSync(advertisment.advertismentImageURL);
            await Advertisment.findByIdAndUpdate({ _id: id }, { title, advertismentImageURL: path.join('uploads/advertisment', uniqueSuffix + '-' + advertismentImageURL.name), isActive : isActive })
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
        else if(title && !advertismentImageURL) {
            await Advertisment.findByIdAndUpdate({ _id: id }, {title: title, advertismentImageURL: advertisment.advertismentImageURL, isActive : isActive })
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

const deleteAdvertisment = async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const advertisment = await Advertisment.findById({ _id: id }).catch(error => error =>{ return });
    if (!advertisment) {
        res.json({status:400, message: "Please enter a valid id" })
    }
    else {
        fs.unlinkSync(advertisment.advertismentImageURL);
        await Advertisment.findByIdAndDelete({ _id: id })
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

const getAllAdvertisments = async (req, res) => {
    let { page, size } = req.query;
    let totalRes;
    if (!page) {
        page = 1
    }
    if (size == undefined || !size) {
       size = totalRes;
    }
    const limit =  Math.abs(parseInt(size));
    const skip = (page - 1) * limit;
    try {
        const allAdvertisments = await Advertisment.find({}).limit(limit).skip(skip);
        totalRes = await Advertisment.count();
        const totalPages = Math.ceil(totalRes / limit);
        res.send({status:200, message: "Success", totalRes, totalPages, allAdvertisments });

    } catch (error) {
        res.json({status:500, message: "Something went wrong" })
    }
}


const getAllActiveAdvertisments = async (req, res) => {
    try {
        const allActiveAdvertisments = await Advertisment.find({isActive: true});
        res.send({status:200, message: "Success", allActiveAdvertisments });

    } catch (error) {
        res.json({status:500, message: "Something went wrong" })
    }
}

const getAdvertismentById = async (req, res) => {
    const {id} = req.params;
    try {
        const advertisment = await Advertisment.findOne({_id: id});
        res.send({status:200, message: "Success", advertisment });
    } catch (error) {
        res.json({status:500, message: "Something went wrong" })
    }
}


module.exports = {
    addAdvertisment,
    updateAdvertisment,
    deleteAdvertisment,
    getAllAdvertisments,
    getAdvertismentById,
    getAllActiveAdvertisments
}
