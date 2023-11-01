import CouponModel from "../../../../DB/models/cupon.model.js";
import cloudinary from "../../../utils/Cloudinary.js";
import { asyncHandler } from "../../../utils/erroHandling.js";
import mongoose from "mongoose";

export const Update = asyncHandler(async (req,res,next) =>{
    if(Object.keys(req.body).length == 0 && !req.file){
        return next(new Error ( ' There is no data sent '),{cause : 300})
    }
    const {CuponId} = req.params;
    const TheCoupon = await CouponModel.findById(CuponId) 
    if(!mongoose.Types.ObjectId.isValid(CuponId)|| !TheCoupon ){
        return next (new Error('The CouponID isn`t valid'),{cause : 400});
    }
    const Update = await CouponModel.findById( CuponId);
    
    if(req.body.name){
        if(req.body.name == Update.name){return next(new Error('Canno`t Update to same Name ' ))}
        const findCoupon = await CouponModel.findOne({name : req.body.name})
        if(findCoupon){
            return next(new Error('Coupon Name Duplicated '),{cause : 400})
        }
        Update.name= req.body.name;  
    }
    
    if(req.body.expireDate){
        Update.expireDate = req.body.expireDate;
    }
    if(req.body.amount){
        Update.amount = req.body.amount;
    }
    
    if (req.file){
        const {secure_url , public_id}= await cloudinary.uploader.upload(req.file.path,{folder: `${process.env.PROJECTCLOUDFOLDER}/Coupons`});
        if(Object.keys(Update.image).length == 0){   
            await cloudinary.uploader.destroy(Update.image.public_id);
        }
        Update.image ={secure_url , public_id}
    }
    
    
    await Update.save();
    res.status(202).json ({Message : 'Done' , Update})

})