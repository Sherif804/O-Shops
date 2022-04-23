const joi = require('joi');

module.exports = {
    addWishlistValidation: {
        body: joi.object().required().keys({
            user: joi.string().empty('').optional().messages({
                "string.empty": "Please enter a valid user"
            }),
            productId: joi.alternatives().required().try(
                joi.string().empty('').required().messages({
                    "any.required": "You have to enter at least one product",
                    "string.empty": "You have to enter at least one product"
                })
                , joi.array().required().min(1).items(joi.string().empty('').required().messages({
                    "any.required": "You have to enter at least one product",
                    "string.empty": "You have to enter at least one product"
                })).messages({
                    "array.min": "You have to enter at least one product"
                })).messages({
                    "any.required": "You have to enter at least one product"
                })
        })
    },
    removeProductFromWishlistValidaton: {
        body: joi.object().required().keys({
            user: joi.string().empty('').optional().messages({
                "string.empty": "Please enter a valid user"
            }),
            productId: joi.alternatives().required().try(
                joi.string().empty('').required().messages({
                    "any.required": "You have to enter at least one product",
                    "string.empty": "You have to enter at least one product"
                })
                , joi.array().required().min(1).items(joi.string().empty('').required().messages({
                    "any.required": "You have to enter at least one product",
                    "string.empty": "You have to enter at least one product"
                })).messages({
                    "array.min": "You have to enter at least one product"
                })).messages({
                    "any.required": "You have to enter at least one product"
                })
        })
    }
}