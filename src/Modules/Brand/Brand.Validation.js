import Joi from "joi";

export const brandCreate = Joi.object({
    name : Joi.string().min(3).required()
}).required()


export const brandUpdate = Joi.object({
    name : Joi.string().min(3).optional(),}).required()



export const brandDelete = Joi.object({
    name : Joi.string().min(3).required()
}).required();




export const brandAllSearch = Joi.object({
}).required();