import  {  model , Schema } from "mongoose";

const BrandSchema = new Schema({
name:{
        type:String,
        unique : true ,
        lowercase : true, 
        required : true
},
image:{
    secure_url:{
        type:String, 
        required:true
        },
    public_id :{
        type : String,
        required : true
    }
    
    },

createdBy : {
    type : Schema.Types.ObjectId,
    ref: 'User',
    required : true         //Convert to true after adding the user
},
updatedBy : {
    type : Schema.Types.ObjectId,
    ref: 'User',
    required : false      
},
subCategoryId :[{
    type: Schema.Types.ObjectId,
    ref : 'SubCategory',
    required:true
}]

},{
    timestamps:true
});



export const brandModel = model('Brand' , BrandSchema);