import cartModel from "../../../DB/models/cart.model.js"
import {productModel} from "../../../DB/models/product.model.js"


export const clearCart = async (userId) => {
    await cartModel.findOneAndUpdate({user: userId} , {products : []})
}

export const updateSock = async (products, placeOrder) => {
    if (placeOrder) {
    for (const product of products) {
        console.log(product.quantity , products);
        await productModel.findByIdAndUpdate(product.productId , {
            $inc : {
                availableItems : -product.quantity,
                soldItems : product.quantity
            }
        })
    } 
} else {
    for (const product of products) {
        console.log(product.quantity , products);
        await productModel.findByIdAndUpdate(product.productId , {
            $inc : {
                availableItems : product.quantity,
                soldItems : -product.quantity
            }
        })
    } 
}
    
}