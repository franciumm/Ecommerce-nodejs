
import { Router } from "express";
import Joivalidation from "../../middelwares/JoiValidation.js";
import * as BrandValidation from './Brand.Validation.js';
import * as brandStart from './controller/Brand.Start.js';
import * as brandSearch from './controller/Brand.Search.js'
import * as brandEdit from './controller/Brand.Edit.js'
import { multerCloudFunction } from "../../utils/MulterCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import CouponRouter from '../Coupon/Copun.router.js';
import { isAuth } from "../../middelwares/auth.js";

const router = Router();


router.use('/:brandid/coupon',CouponRouter )

router.post('/create',isAuth, multerCloudFunction (allowedExtensions.image).single('image') ,Joivalidation(BrandValidation.brandCreate),brandStart.createbrand);
router.put('/update/:brandid',isAuth,multerCloudFunction (allowedExtensions.image).single('image'),Joivalidation(BrandValidation.brandUpdate) , brandEdit.BrandUpdate);
router.get('/all' , Joivalidation(BrandValidation.brandAllSearch),brandSearch.GetAllBrands);
export default router;
