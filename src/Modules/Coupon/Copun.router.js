import { Router } from "express";
import * as CouponStartC from './Controller/Coupon.Start.js';
import * as CouponEditC from './Controller/Coupon.Edit.js';
import Joivalidation from "../../middelwares/JoiValidation.js";
import * as validations from './Coupon Validation.js'
import { multerCloudFunction } from "../../utils/MulterCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
const router = Router({mergeParams : true});

router.post ('/create',multerCloudFunction(allowedExtensions.image).single('image'),Joivalidation(validations.CouponCreate),CouponStartC.CouponCreate);
router.put('/update/:CuponId' ,multerCloudFunction(allowedExtensions.image).single('image'),Joivalidation(validations.CouponUpdate) , CouponEditC.Update);
export default router;