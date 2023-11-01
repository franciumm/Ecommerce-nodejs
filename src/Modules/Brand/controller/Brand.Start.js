import mongoose from "mongoose";
import { brandModel } from "../../../../DB/models/brand.model.js";
import CategoryModel from "../../../../DB/models/category.model.js";
import { SubCategoryModel } from "../../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../../utils/erroHandling.js";
import cloudinary from "../../../utils/Cloudinary.js";


export const createbrand = asyncHandler(async(req,res,next)=>{
    const {_id} = req.user;
    const {name} = req.body;
    const {subCategoryId} = req.query;
    
    if(!mongoose.Types.ObjectId.isValid(subCategoryId)||!await SubCategoryModel.findById(subCategoryId)){
        return next(new Error('SubCategory Id in-valid', {cause : 400}));
    }

    if(await brandModel.findOne({name})){
        return next(new Error('Brand name is already made' , {cause : 400}));
    }
    if(!req.file){
        return next(new Error('Please Upload Brand Image' , {cause : 400}));
    }

    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path,{folder: `${process.env.PROJECTCLOUDFOLDER}/Brands`})

    const createbrand = await brandModel.create({name  , image : {public_id, secure_url},subCategoryId: [subCategoryId], createdBy:_id});
    if(!createbrand){
        await cloudinary.uploader.destroy(public_id);
        return next (new Error('Error While Creating The Brand'),{cause : 400} )
    }
    res.status(200).json({message :'Added', createbrand})
}) 