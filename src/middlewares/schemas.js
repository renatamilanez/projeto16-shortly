import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().email({ minDomainSegments: 2, tlds: {allow: ['com', 'net', 'br']}}).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: Joi.ref('password')
});

const loginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: {allow: ['com', 'net', 'br']}}).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

const urlSchema = Joi.object({
    url: Joi.string().uri().required()
});

export {userSchema, loginSchema, urlSchema};