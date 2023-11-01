import  {  model , Schema } from "mongoose";

const productSchema = new Schema ({
title :{
    lowercase:true,
    type:String
    ,required:true
},

desc:String , 

slug : {
    type:String , 
    required:true , 
    lowercase:true 
},

colors : [String],

sizes: [String],

price : {required:true , type:Number},

discount : {type : Number , default:0 },

stock : {default : 1 , type : Number , required:true},
images : [
    {secure_url:{required:true,type:String},public_id:{type:String , required:true}}
],
createdBy : {
    type : Schema.Types.ObjectId,
    ref: 'User',
    required : true         //Convert to true after adding the user
},
updatedBy : {
    type : Schema.Types.ObjectId,
    ref: 'User',
},
deletedBy : {
    type : Schema.Types.ObjectId,
    ref: 'User',
},
subCategoryId :{
    type: Schema.Types.ObjectId,
    ref : 'SubCategory',
    required:true
}
,
categoryId : {
    type: Schema.Types.ObjectId,
    ref : 'Category',
    required:true
},
brandId : {
    type: Schema.Types.ObjectId,
    ref : 'Brand',
    required:true
},
priceAtfterDiscount :Number,
},{timestamps:true});


export const productModel = model('Product',productSchema)