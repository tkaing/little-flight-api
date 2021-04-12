const { body } = require('express-validator');
const {
    messageNotEmpty,
    messageIsLength,
    messageIsFloat,
} = require('./../api_constraint');

module.exports = {
    default: [
        body('username')
            .notEmpty().withMessage(messageNotEmpty())
            //.isFloat({ min: 0, locale: "fr-FR" }).withMessage(messageIsFloat())
            .isLength({ min: 2, max: 20 }).withMessage(messageIsLength(2, 20)),
        body('password')
            .notEmpty().withMessage(messageNotEmpty())
            .isLength({ min: 4 }).withMessage(messageIsLength(4)),
    ]
};