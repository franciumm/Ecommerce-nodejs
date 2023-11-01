import joi from "joi"

const isValidObjectID = (value , helper) => {
    return Types.ObjectId.isValid(value) 
    ? true 
    : helper.message("Invalid objectID!");
}

export const createOrder = joi.object({
    address : joi.string().min(5).required(),
    copoun : joi.string().length(5),
    phone : joi.string().length(11).required(),
    payment : joi.string().valid("cash","visa").required()
}).required();

export const cancelOrder = joi.object({
    orderId : joi.string().custom(isValidObjectID).required(),
}).required()





