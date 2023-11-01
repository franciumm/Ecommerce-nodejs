import slugify from "slugify";
import cloudinary from '../../../utils/Cloudinary.js'
import { asyncHandler } from "../../../utils/erroHandling.js";
import CategoryModel from '../../../../DB/models/category.model.js'
import { UserModel } from "../../../../DB/models/user.model.js";

export const CreatCategory = asyncHandler(
    async (req,res,next)=>{
    const {_id} = req.user;
    const {name} = req.body;

    const slug = slugify(name , '-');


    if(await CategoryModel.findOne({name})){
        return next(new Error('Category name is already made' , {cause : 400}));
    }
    if(!req.file){
        return next(new Error('Please Upload Category Image' , {cause : 400}));
    }

    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path,{folder: `${process.env.PROJECTCLOUDFOLDER}/Categories`})

    const createCategory = await CategoryModel.create({name , slug , image : {public_id, secure_url}, CreatedBy:_id});
    if(!createCategory){
        await cloudinary.uploader.destroy(public_id);
        return next (new Error('Error While Creating The Category'),{cause : 400} )
    }
    res.status(200).json({message :'Added',createCategory})
}
)
