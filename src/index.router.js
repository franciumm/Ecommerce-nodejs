import DBConnect from '../DB/DB.Connect.js';
import { globalerrorHandling } from './utils/erroHandling.js';
import auth from './auth/auth.router.js'
import CategoryRouter from './Modules/Category/Category.router.js'
import BrandRouter from './Modules/Brand/Brand.router.js'
import ProductRouter from './Modules/product/porduct.router.js'
import cartRouter from './Modules/cart/cart.router.js'
import orderRouter from './Modules/order/order.router.js'

const bootstrape =  async (app,express)=>{
    app.use(express.json());
    
    DBConnect();

    app.use('/category',CategoryRouter);

    app.use('/brand' , BrandRouter);

    app.use('/product',ProductRouter )

    app.use('/user',auth);

    app.use("/cart" , cartRouter);

    app.use("/order" , orderRouter);

    app.use(globalerrorHandling);

    app.use('*',(req,res,next) => {return res.status(404).json('In-Valid Routing')});

    
}


export default bootstrape;