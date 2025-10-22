import Joi from "joi";

const registerUserValidation = Joi.object({
    password: Joi.string().min(8).required(),
    name: Joi.string().max(30).required(),
    email: Joi.string().email().required()
});

const loginUserValidation = Joi.object({
    email: Joi.string().max(100).required(),
    password: Joi.string().required()
});

export {
    registerUserValidation,
    loginUserValidation
}