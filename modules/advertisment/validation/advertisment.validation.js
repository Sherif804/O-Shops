const joi = require('joi');

module.exports = {
    addAdvertismentValidation: {
        body: joi.object().required().keys({
            title: joi.string().required().messages({
                "string.empty": "You have to enter title",
                "any.required": "You have to enter title"
            }),
            advertismentImageURL: joi.object().required().messages({
                "object.empty": "You have to enter advertisment image",
                "any.required": "You have to enter advertisment image"
            }),
            isActive: joi.boolean().optional().default(false).messages({
                "boolean.base": "please enter a valid status"
            })
        })
    },
    updateAdvertismentValidation: {
        body: joi.object().required().keys({
            title: joi.string().optional().messages({
                "string.empty": "You have to enter title"
            }),
            advertismentImageURL: joi.object().optional().messages({
                "object.empty": "You have to enter advertisment image"
            }),
            isActive: joi.boolean().optional().default(false).messages({
                "boolean.base": "please enter a valid status"
            })
        })
    },
    
}