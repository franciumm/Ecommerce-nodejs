import { asyncHandler } from "../../../utils/erroHandling.js";
import orderModel from "../../../../DB/models/order.model.js";
import Stripe from "stripe";



export const orderWebhook = asyncHandler(async (request, response) => {
    const sig = request.headers['stripe-signature'];
    const stripe = new Stripe(process.env.STRIPE_KEY);
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.ENDPOINT_SECRET);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

// Handle the event
        const orderId = event.data.object.metadata.order_id;    
        if (event.type === "checkout.session.completed") {
            await orderModel.findOneAndUpdate({_id : orderId} , {status : "visa paied"});
               // update stock 
               // clear cart 
            return ;
        }
        await orderModel.findOneAndUpdate({_id : orderId} , {status : "failed to pay"});
        return ;

})