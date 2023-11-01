import Joi from "joi";

export const CategoryCreate = Joi.object({
    name : Joi.string().min(3).required()
}).required()


export const CategoryUpdate = Joi.object({
    name : Joi.string().min(3).optional(),}).required()



export const CategoryDelete = Joi.object({
    name : Joi.string().min(3).required()
}).required();




export const CategoryAllSearch = Joi.object({
}).required();