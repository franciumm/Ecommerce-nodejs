import { SubCategoryModel } from "../../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../../utils/erroHandling.js";

export const SubCategoryAllSearch =asyncHandler(async (req,res,next)=>{
const {categoryId } = req.params;
const theSubCats = await SubCategoryModel.find({categoryId});
res.status(201).json(theSubCats);

})