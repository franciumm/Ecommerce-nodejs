import Joi from "joi";

export const  signup = Joi.object({
    userName : Joi.string().min(2).max(20).required(),
    email:Joi.string().email({ minDomainSegments: 2,maxDomainSegments:3, tlds: { allow: ['com', 'net','eg','edu'] } }).required(),
    password:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]{3,30}$/)).required(),
    cPassword: Joi.string().valid(Joi.ref('password')).required(),
    phone: Joi.string().max(13).min(10).required(),
    gender: Joi.string().required().valid('male', 'female').required(),
    age : Joi.number().integer().positive().min(10).max(100).required(),

}).required()


export const  Login = Joi.object({
    email:Joi.string().email({ minDomainSegments: 2,maxDomainSegments:3, tlds: { allow: ['com', 'net','eg','edu'] } }).required(),
    password:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]{3,30}$/)).required(),

}).required()