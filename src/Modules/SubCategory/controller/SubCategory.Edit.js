import mongoose from "mongoose";
import { asyncHandler } from "../../../utils/erroHandling.js";
import CategoryModel from "../../../../DB/models/category.model.js";
import { SubCategoryModel } from "../../../../DB/models/subcategory.model.js";
import cloudinary from "../../../utils/Cloudinary.js";
import slugify from "slugify";

export const SubCategoryUpdate = asyncHandler(async(req,res,next)=>{
    if(Object.keys(req.body).length == 0 && !req.file){
        return next(new Error ( ' There is no data sent '),{cause : 300})
    }
    
    const {name} = req.body;
    const {categoryId,subCatid} = req.params;
    
    const TheCat = await CategoryModel.findById(categoryId);
    if(!mongoose.Types.ObjectId.isValid(categoryId)|| !TheCat ){
        return next (new Error('The CategoryID isn`t valid'),{cause : 400});
    }

    const subCat = await SubCategoryModel.findOne({_id:subCatid , CreatedBy: req.user._id});
    if(subCat.categoryId != categoryId){

        next(new Error('The Category Id isn`t for that SubCategory'), {cause : 401})

    }

    if(await SubCategoryModel.findOne({name}) ){
        return next(new Error('The SubCategory Name does already exsits'), { cause : 400});
    }

    const slug = slugify(name , '-')
    if(req.file){
        const oldpublic = subCat.image.public_id
        const {secure_url , public_id}= await cloudinary.uploader.upload(req.file.path ,{folder: `${process.env.PROJECTCLOUDFOLDER}/Categories/${categoryId}/SubCategories`});
        subCat.image = {public_id , secure_url};
        subCat.name = name;
        subCat.slug = slug
        subCat.save();
        await cloudinary.uploader.destroy(oldpublic);
        return res.status(201).json({Message:'Done',subCat})
    }
    subCat.name = name;
    subCat.slug = slug;
    subCat.updatedBy = req.user._id;
    subCat.save();
    res.status(201).json({Message:'Done',subCat})
})