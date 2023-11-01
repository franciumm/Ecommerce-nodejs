import mongoose from "mongoose";
import CouponModel from "../../../../DB/models/cupon.model.js";
import cloudinary from "../../../utils/Cloudinary.js";
import { asyncHandler } from "../../../utils/erroHandling.js";
import CatergoryModel from '../../../../DB/models/category.model.js'
import {UserModel} from '../../../../DB/models/user.model.js'


export const CouponCreate = asyncHandler(async (req,res,next)=>{
    const {name} = req.body;
    const {categoryId} = req.query;


    if(!mongoose.Types.ObjectId.isValid(req.user._id) || !await UserModel.findById(req.user._id)){
        return next(new Error('The Creator Id is in-valid'),{cause : 400});
    }
    if(await CouponModel.findOne({name}) ){
        return next (new Error('Duplicated Coupon name'), {cause : 409});
    }
    if(!mongoose.Types.ObjectId.isValid(categoryId)|| !await CatergoryModel.findById(categoryId)  ){
        return next (new Error('In-Valid Category Id'), {cause : 409});
    }
    var now =Date.parse(new Date()) ;
    const exp  = Date.parse(req.body.expireDate);
    if (now >exp) {
        return next (new Error ('The Date is Expired'))
    }

    if(req.file){
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path,{folder: `${process.env.PROJECTCLOUDFOLDER}/Coupons`});
        req.body.image = {secure_url , public_id}
        
    }

    req.body.addedBy=req.user._id;
    req.body.categoryId=categoryId;



    const Coupon = await CouponModel.create(req.body);
    res.status(201).json({ Coupon , Message : 'Done' });
})