import { Router } from "express";
import { multerCloudFunction } from "../../utils/MulterCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import Joivalidation from "../../middelwares/JoiValidation.js";
import * as ProductValidation from './product.validation.js';
import * as ProductStart from './controller/product.Start.js' 
import * as ProductEdit from './controller/product.edit.js'
import * as SearchC from './controller/products.Search.js'
import { isAuth } from "../../middelwares/auth.js";
const router = Router();

router.post ('/create',isAuth,multerCloudFunction(allowedExtensions.image).array('image',5),ProductStart.Create)
router.put ('/update',isAuth,multerCloudFunction(allowedExtensions.image).array('image',5),ProductEdit.Update)
router.get ('/Search/all', SearchC.allProducts)
router.get ('/Search/', SearchC.productsbytitle)

export default router ;



