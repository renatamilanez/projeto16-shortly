import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().email({ minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: Joi.ref('password').required()
});

const loginSchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

const urlSchema = Joi.object({
    shortUrl: Joi.string().uri({scheme: ['git',/git\+https?/]}).required()
});

export {userSchema, loginSchema, urlSchema};