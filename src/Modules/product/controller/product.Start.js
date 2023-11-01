import { mongoose } from "mongoose";
import CategoryModel from "../../../../DB/models/category.model.js";
import { SubCategoryModel } from "../../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../../utils/erroHandling.js";
import { brandModel } from "../../../../DB/models/brand.model.js";
import slugify from "slugify";
import cloudinary from '../../../utils/Cloudinary.js'
import {productModel} from "../../../../DB/models/product.model.js";


export const  Create = asyncHandler(async(req,res,next)=>{
const {title , desc , price , discount,colors , sizes,stock}= req.body;
const {categoryId , subCategoryId,brandId}= req.query;
const {_id}= req.user

const aproduct = await productModel.findOne({brandId,title});

if(aproduct ){
    return next (new Error ('The product does already exists'));
}

const findCat = await CategoryModel.findById( categoryId);
if(!mongoose.Types.ObjectId.isValid(categoryId)||!findCat){
    return next(new Error('in-valid Category Id ', {cause : 400}));
}
const subcategoryFind = await SubCategoryModel.findById(subCategoryId);

if(!mongoose.Types.ObjectId.isValid(subCategoryId)||!subcategoryFind || subcategoryFind.categoryId.toString() != categoryId ){
    return next(new Error('in-valid SubCategory Id ', {cause : 400}));
}
const brand = await brandModel.findById(brandId);
if(!mongoose.Types.ObjectId.isValid(brandId)||!brand){
    return next(new Error('in-valid Brand Id ', {cause : 400}));
}
var id = new mongoose.Types.ObjectId();
const slug = slugify(title,'-');
const priceAtfterDiscount = price * (1- ((discount||0) /100));
if(!req.files){
    return next(new Error('Upload Pictures please', {cause : 400}));
}
const images =[];
const publics = [];

for(const file of req.files) {
    const {secure_url , public_id} = await cloudinary.uploader.upload(file.path,{folder :`${process.env.PROJECTCLOUDFOLDER}/Brands/${brandId}/Products/${id}`});
    images.push({secure_url , public_id});
    publics.push(public_id);
}
req.ImagePath = `${process.env.PROJECTCLOUDFOLDER}/Brands/${brandId}/Products/${id}`
const Theproduct =await  productModel.create({_id :id,title , desc , price , discount,colors , sizes,stock,categoryId ,images, subCategoryId,brandId,slug,priceAtfterDiscount,createdBy: _id})

if(!Theproduct){
    await cloudinary.api.delete_resources(publics);
    await cloudinary.api.delete_folder(req.ImagePath);
    return next(new Error ( ' Error Ocurred Creating the Product'),{cause : 400})
}
res.status (201).json({Message:'Done' , Theproduct});

})