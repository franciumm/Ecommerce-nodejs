import { Router } from "express";
import Joivalidation from "../../middelwares/JoiValidation.js";
import * as CategoryValidation from './Category.Validation.js';
import * as CategoryStart from './controller/CategoryStart.js';
import * as CategorySearch from './controller/Category.Search.js'
import * as CategoryEdit from './controller/Category.Edit.js'
import { multerCloudFunction } from "../../utils/MulterCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import SubCategoryRouter from '../SubCategory/SubCategory.router.js';
import CouponRouter from '../Coupon/Copun.router.js'
import { isAuth } from "../../middelwares/auth.js";
const router = Router();

router.post('/create', isAuth,multerCloudFunction (allowedExtensions.image).single('image') ,Joivalidation(CategoryValidation.CategoryCreate),CategoryStart.CreatCategory);
router.put('/update/:categoryid',isAuth,multerCloudFunction (allowedExtensions.image).single('image'),Joivalidation(CategoryValidation.CategoryUpdate) , CategoryEdit.UpdateCategory);
router.get('/all' , Joivalidation(CategoryValidation.CategoryAllSearch),CategorySearch.GetAllCategories);
router.get('/ByID',CategorySearch.GetByidCategories);
router.use('/coupon',isAuth,CouponRouter )
router.use('/:categoryId/subcategory',isAuth,SubCategoryRouter )
router.delete('/:categoryid',isAuth,CategoryEdit.DeleteCategory)
export default router;