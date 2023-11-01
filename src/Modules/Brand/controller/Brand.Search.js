import { brandModel } from "../../../../DB/models/brand.model.js";
import { asyncHandler } from "../../../utils/erroHandling.js";

export const GetAllBrands = asyncHandler(async(req , res,next)=>{
    const brands = await brandModel.find();
    res.status (200).json(brands)
})