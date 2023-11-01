import cloudinary from "./Cloudinary.js";



export const asyncHandler = (fn) => {
    return (req,res,next)=>{
        fn(req,res,next).catch(async (err) =>{
            if(req.ImagePath){
                await cloudinary.api.delete_resources(publics);
                await cloudinary.api.delete_folder(req.ImagePath)
            }
            return next(new Error (err , {cause : 500}))
        })
    }

}




export const globalerrorHandling = (error , req,res,next)=>{
    
    if (error){return res.status(error.cause || 500 ).json(error.message)
    }
}