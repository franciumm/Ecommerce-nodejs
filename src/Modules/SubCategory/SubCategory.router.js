import { Router } from "express";
import * as subcStart from './controller/SubCategory.Start.js' 
import *as subcsearch from './controller/SubCategory.Search.js'
import { multerCloudFunction } from "../../utils/MulterCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import Joivalidation from "../../middelwares/JoiValidation.js";
import * as subcatEdit from './controller/SubCategory.Edit.js';
import * as Subcat from './Joi.Validation.js'
import { isAuth } from "../../middelwares/auth.js";

const router = Router({mergeParams:true});

router.put('/update/:subCatid',isAuth,multerCloudFunction(allowedExtensions.image).single('image'), Joivalidation(Subcat.SubCategoryUpdate),subcatEdit.SubCategoryUpdate);
router.post('/create' ,isAuth,multerCloudFunction(allowedExtensions.image).single('image'),Joivalidation(Subcat.SubCategoryCreate),subcStart.SubCategoryCreate);
//------------------------------------------Delete Sub ------------------------------------------------------------------//
router.get('/all',Joivalidation(Subcat.SubCategoryAllSearch),subcsearch.SubCategoryAllSearch )
export default router;