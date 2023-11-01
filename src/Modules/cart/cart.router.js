import {Router} from "express"
import { isAuth } from "../../middelwares/auth.js";
import isValid from '../../middelwares/AdminVald.js'
import * as cartController from './controler/cart.controller.js'
import * as cartShemas from './cart.validation.js'

const router = Router();

router.post('/' , 
isAuth,
    isValid(cartShemas.cart),
    cartController.addtocart
)

router.get('/', isAuth , cartController.userCart)

router.patch('/' , 
isAuth,
    isValid(cartShemas.cart),
    cartController.updateCart
)

router.patch('/clear' , 
isAuth,
    cartController.clearCart
)

router.patch('/:productId' , 
isAuth,
    isValid(cartShemas.removeProductFromCart),
    cartController.removeProductFromCart
)

export default router