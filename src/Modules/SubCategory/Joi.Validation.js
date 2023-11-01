import Joi from "joi";

export const SubCategoryCreate = Joi.object({
    name : Joi.string().min(3).required(),
}).required()


export const SubCategoryUpdate = Joi.object({
    name : Joi.string().min(3).optional(),

}).required()



export const SubCategoryDelete = Joi.object({
    name : Joi.string().min(3).required()
}).required();




export const SubCategoryAllSearch = Joi.object({
}).required();