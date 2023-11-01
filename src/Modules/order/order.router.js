import { Router } from "express"
import * as orderControllerStart from "./controller/order.start.js" 
import * as orderWebhook from './controller/order.webhook.js'
import * as orderSchemas from "./order.validation.js" 
import {isAuth} from "../../middelwares/auth.js";
import isValid from '../../middelwares/AdminVald.js'
import express from "express"

const router = Router();

router.post("/" , 
isAuth, 
    isValid(orderSchemas.createOrder), 
    orderControllerStart.createOrder
)

router.patch("/:orderId" , 
isAuth, 
    isValid(orderSchemas.cancelOrder) , 
    orderControllerStart.cancelOrder
)




router.post('/webhook', 
    express.raw({type: 'application/json'}), 
    orderWebhook.orderWebhook
    );


export default router