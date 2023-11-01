import slugify from "slugify";
import cloudinary from '../../../utils/Cloudinary.js'
import { asyncHandler } from "../../../utils/erroHandling.js";
import CategoryModel from '../../../../DB/models/category.model.js'
import mongoose from "mongoose";
import { SubCategoryModel } from "../../../../DB/models/subcategory.model.js";


export const UpdateCategory = asyncHandler(async (req,res,next)=>{
    const {_id} = req.user;
    if(Object.keys(req.body).length == 0 && !req.file){
        return next(new Error ( ' There is no data sent '),{cause : 300})
    }
    
    const {name} = req.body;

    const newCatNameCheck = await CategoryModel.findOne({name});
    if(newCatNameCheck){
        return res.json('The new Category name is already in use');
    }
    if(!mongoose.Types.ObjectId.isValid(req.params.categoryid)&&!mongoose.Types.ObjectId.isValid(_id)){return next(new Error('Please enter Valid Category ID'),{cause : 400});}

    const CatCheck = await CategoryModel.findOne({_id : req.params.categoryid, CreatedBy : _id});



    if(!CatCheck ){ return next(new Error('Your are not the Category owner '),{cause : 400});}
    
    if(req.file){
        const OldPublic = CatCheck.image.public_id;
        const {secure_url , public_id}  = await cloudinary.uploader.upload(req.file.path,{folder: `${process.env.PROJECTCLOUDFOLDER}/Categories`});
        CatCheck.image.public_id = public_id;
        CatCheck.image.secure_url = secure_url;
        await CatCheck.save();
        await cloudinary.uploader.destroy(OldPublic);
    }
    const slug = slugify(name , '-');
    CatCheck.name = name ;
    CatCheck.slug= slug;
    CatCheck.updatedBy = _id;
    await CatCheck.save();
    res.status(201).json(CatCheck);
});

export const DeleteCategory = asyncHandler(async(req,res,next)=>{
    const {_id} = req.user;
    const {categoryid}= req.body
    

if( !mongoose.Types.ObjectId.isValid(categoryid)||!await CategoryModel.findOne({_id : categoryid , CreatedBy: _id})){

    return next(new Error('Please enter Valid Category ID'),{cause : 400});

}
const CatCheck = await CategoryModel.findOneAndDelete({_id : categoryid , CreatedBy: _id});
await cloudinary.uploader.destroy(CatCheck.image.public_id);





const DeleteSubCat = await SubCategoryModel.deleteMany({categoryId:categoryid});
const Deleteproducts = await SubCategoryModel.deleteMany({categoryId:categoryid});



res.status(200).json({Message : 'Done',CatCheck})
});

