import CategoryModel from "../../../../DB/models/category.model.js";
import { asyncHandler } from "../../../utils/erroHandling.js";

export const GetAllCategories = asyncHandler(async(req,res,next)=>{
    const Cats = await CategoryModel.find().populate([{
        path:'SubCategories',
        populate : [{path:'Brands'}]

}]);
    res.json(Cats);
})



export const GetByidCategories = asyncHandler(async(req,res,next)=>{
    const {id }= req.query;
    const Cats = await CategoryModel.findById(id).populate([{
        path:'SubCategories',
        populate : [{path:'Brands'}]

}]);

    res.json(Cats);
})