import { asyncHandler } from "../../../utils/erroHandling.js";
import cartModel from '../../../../DB/models/cart.model.js'
import copounModel from '../../../../DB/models/cupon.model.js'
import {productModel} from '../../../../DB/models/product.model.js'
import orderModel from "../../../../DB/models/order.model.js";
import { createInvoice } from "../../../utils/createInvoice.js";
import cloudinary from "../../../utils/Cloudinary.js"
import sendEmail from  "../../../utils/Mailer.js"
import path from "path"
import {fileURLToPath} from 'url'
import { clearCart, updateSock } from "./../order.services.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));


export const createOrder = asyncHandler(async (req,res,next) => {
    
    const { payment, address, copoun, phone } = req.body;

    
    let checkCopoun;
    if (copoun) {
        checkCopoun = await copounModel.findOne({
            code : copoun, 
            expires : {$gt : Date.now()}
        });
        if(!checkCopoun) return next(new Error("Invalid copoun"))
    }

    
    const cart = await cartModel.findOne({user : req.user._id});
    const products = cart.products;
    if (products.length < 1) return next(new Error("Empty cart!"));

    let orderProducts = [];
    let orderPrice = 0;

    for (let i = 0; i < products.length; i++) {
        const product = await productModel.findById(products[i].productId);
        if(!product) 
            return next(new Error(`product ${products[i].productId} not fount`))
        if(!product.inStock(products[i].quantity)) 
            return next(new Error(`${product.title} is out of stock`))
        orderProducts.push({
            productId : product._id,
            quantity : products[i].quantity,
            name : product.title,
            itemPrice : product.finalPrice,
            totalPrice : products[i].quantity * product.finalPrice
        });
        orderPrice += products[i].quantity * product.finalPrice;
    }

    const order = await orderModel.create({
        user: req.user._id,
        products : orderProducts,
        address,
        phone,
        copoun : {
            id : checkCopoun?._id,
            code : checkCopoun?.code,
            discount : checkCopoun?.discount
        },
        payment,
        price : orderPrice,
    })

    // generate invoice 
    const user = req.user;
    const invoice = {
        shipping : {
            name : user.userName,
            address : order.address,
            country : "Egypt"
        },
        items : order.products,
        subtotal : order.price,
        paid : order.finalPrice,
        invoice_nr : order._id
    }
    const pdfpath = path.join(
        __dirname,
        `../../../invoiceTemps/${order._id}.pdf`
    )
    createInvoice(invoice, pdfpath)

    
    const {secure_url, public_id} = await cloudinary.uploader.upload(pdfpath, {
        folder : `${process.env.FOLDER_CLOUD_NAME}/order/invoice/${user._id}`
    })

    
    order.invoice = {id : public_id, url : secure_url};
    await order.save();

    let message = {
        attachments : [
            {
                path : secure_url,
                contentType : "application/pdf"
            },
        ]
    }
    // send email
    const isSent = await sendEmail({
        to : user.email, 
        subject : "Order invoice" , 
        attachments : message,
    })
    if (isSent) {
        
        updateSock(order.products, true)
        clearCart(user._id)
    }

    return res.json({success:true, msg:"order placed successfully" , })
});

export const cancelOrder = asyncHandler(async (req,res,next) => {
    const {orderId} = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) return next(new Error("order not found" , {cause : 404}));
    if (order.status === "shipped" || order.status === "delivered") {
        return next(new Error("cannot cancel order now"));
    }
    order.status = "canceled"
    await order.save();
    updateSock(order.products, false);
    return res.json({success:true, msg:"order canceled successfully",})
});

