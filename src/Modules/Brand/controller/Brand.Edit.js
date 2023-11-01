import mongoose from "mongoose";
import { brandModel } from "../../../../DB/models/brand.model.js";
import cloudinary from "../../../utils/Cloudinary.js";
import { asyncHandler } from "../../../utils/erroHandling.js";

export const BrandUpdate = asyncHandler(async (req,res,next)=>{ 
    if(Object.keys(req.body).length == 0 && !req.file){
        return next(new Error ( ' There is no data sent '),{cause : 300})
    }


    const {_id} = req.user;
    const {name} = req.body;

    const newBrandNameCheck = await brandModel.findOne({name});


    if(newBrandNameCheck){ 

        return next(new Error('The new Brand name is already in use'),{cause : 400});

    }


    if(!mongoose.Types.ObjectId.isValid(req.params.brandid)){
        return next(new Error('Please enter Valid Brand Id'),{cause : 400});
    }

    const BrandCheck = await brandModel.findOne({_id :req.params.brandid,createdBy: _id});

    if(!BrandCheck){
        return next(new Error('Please enter Valid Brand Id'),{cause : 400});
    }


    if(req.file){
        const OldPublic = BrandCheck.image.public_id;
        const {secure_url , public_id}  = await cloudinary.uploader.upload(req.file.path,{folder: `${process.env.PROJECTCLOUDFOLDER}/Brands`});
        BrandCheck.image.public_id = public_id;
        BrandCheck.image.secure_url = secure_url;
        await BrandCheck.save();
        await cloudinary.uploader.destroy(OldPublic);
    }
    
    BrandCheck.name = name ;
    BrandCheck.updatedBy = _id;
    
    await BrandCheck.save();
    res.status(201).json(BrandCheck);

})