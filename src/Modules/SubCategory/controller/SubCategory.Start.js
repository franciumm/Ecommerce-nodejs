import {asyncHandler} from '../../../utils/erroHandling.js'
import CategoryModel from '../../../../DB/models/category.model.js'
import  mongoose  from 'mongoose';
import cloudinary from '../../../utils/Cloudinary.js';
import { SubCategoryModel } from '../../../../DB/models/subcategory.model.js';
import slugify from 'slugify';

export const SubCategoryCreate = asyncHandler(async (req,res,next) =>{
    const {categoryId} = req.params;
    

    if(!mongoose.Types.ObjectId.isValid(categoryId)||!await CategoryModel.findById(categoryId)){
        return next(new Error('Category Id in-valid', {cause : 400}));
    }
    
    const {name} = req.body;
    const TheCheck =await SubCategoryModel.findOne({name}); 
    
    if(TheCheck){
        return next(new Error('SubCategory name does already exists'),{cause : 400});
    }
    if(!req.file){
        return next (new Error('SubCategory Image is required'),{cause : 400});
    }
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {folder : `${process.env.PROJECTCLOUDFOLDER}/Categories/${categoryId}`});
    const SubCategory = await SubCategoryModel.create ({name ,slug:slugify(name , '-'),image:{public_id,secure_url},categoryId,CreatedBy :req.user._id });
    if(!SubCategory){
        await cloudinary.uploader.destroy(public_id);
        return next (new Error('Error Creating the SubCategory Try again'),{cause : 400});
    }
    res.status(201).json({message: 'Done', SubCategory})
})