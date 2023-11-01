import slugify from "slugify";
import { brandModel } from "../../../../DB/models/brand.model.js";
import CategoryModel from "../../../../DB/models/category.model.js";
import { productModel } from "../../../../DB/models/product.model.js";
import { SubCategoryModel } from "../../../../DB/models/subcategory.model.js";
import cloudinary from "../../../utils/Cloudinary.js";
import { asyncHandler } from "../../../utils/erroHandling.js";
import { mongoose } from "mongoose";



export const Update = asyncHandler(async (req,res,next)=>{
    const {title , desc , price , discount,colors , sizes,stock}= req.body;
    const {productId , categoryId , subCategoryId,brandId}= req.query;

const product = await productModel.findById(productId);

if(!product ){
    return next (new Error ('The product does not exists'));
}
let findCat;
if(categoryId){
    findCat = await CategoryModel.findById( categoryId);
if(!mongoose.Types.ObjectId.isValid(categoryId)||!findCat){
    return next(new Error('in-valid Category Id ', {cause : 400}));
}
}


let subcategoryFind
if(subCategoryId){
    subcategoryFind = await SubCategoryModel.findById(subCategoryId);
if(!mongoose.Types.ObjectId.isValid(subCategoryId)||!subcategoryFind || subcategoryFind.categoryId.toString() != categoryId ){
    return next(new Error('in-valid SubCategory Id ', {cause : 400}));
}
}

const brand = await brandModel.findById(brandId);

if(!mongoose.Types.ObjectId.isValid(brandId)||!brand){
    return next(new Error('in-valid Brand Id ', {cause : 400}));

}

if(discount&& price){
   product.priceAtfterDiscount = price * (1- ((discount||0) /100));
}else if(price){
    product.priceAtfterDiscount = price * (1- ((product.discount||0) /100));
}else if (discount){
    product.priceAtfterDiscount = product.price * (1- ((discount||0) /100));
}

var images= [];
if(title&& req.files?.length){
    const slug = slugify(title,'-');
    if(product.images?.length>0){
        for (const image of product.images){
            await cloudinary.api.delete_resources(image.public_id);
        }
    }
    product.title= title ;
    product.slug= slug;
    product.images.length = 0 ;
    const images =[];
    
for(const file of req.files) {
    const {secure_url , public_id} = await cloudinary.uploader.upload(file.path,{folder :`${process.env.PROJECTCLOUDFOLDER}/Brands/${brandId}/Products/${product.id}`});
    images.push({secure_url , public_id});

}
product.images = images;
}else if(req.files?.length){
    if(product.images.length>0){
        for (const image of product.images){
            await cloudinary.api.delete_resources(image.public_id);
            
        }
        await cloudinary.api.delete_folder(`${process.env.PROJECTCLOUDFOLDER}/Brands/${brandId}/Products/${product.slug}`);
        
    }
    product.images.length = 0 ;  
    for(const file of req.files) {
    
    const {secure_url , public_id} = await cloudinary.uploader.upload(file.path,{folder :`${process.env.PROJECTCLOUDFOLDER}/Brands/${brandId}/Products/${product.slug}`});
    product.images.push({secure_url , public_id});
    
}

}else if ( title ){
    const slug = slugify(title,'-');
    product.title = title;
    product.slug= slug;
}

if(desc){product.desc= desc}
if(colors){product.colors = colors}
if(sizes){product.sizes =sizes}
if(stock&& stock>0){product.stock= stock;}

await product.save();
res.status (201).json(product);
}) 