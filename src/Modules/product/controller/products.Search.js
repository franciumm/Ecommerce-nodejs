import { productModel } from "../../../../DB/models/product.model.js";
import { Apifeatures } from "../../../utils/ApiFeatures.js";
import { asyncHandler } from "../../../utils/erroHandling.js";
import { pagination } from "../../../utils/pagination.js";


export const allProducts = asyncHandler(async(req,res,next)=>{
    

    const Apifeateure = new Apifeatures(productModel.find(), req.query).pagination().filter().sort();
    const products = await Apifeateure.mongooseQuery
    res.status(200).json(products)
})


export const productsbytitle = asyncHandler(async(req,res,next)=>{
    const {productname,size , page}= req.query;    
    const { limit , skip } = pagination({page,size})

    const products = await productModel.find({$or :[{ title : { $regex :  productname , $options : 'i'} },{ desc : { $regex :  productname ,$options:'i'}}]}).limit(limit).skip(skip);
    res.status(200).json (products);
}) 