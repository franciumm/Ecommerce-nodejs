import  {  model , Schema } from "mongoose";

const CategorySchema = new Schema({
name:{
        type:String,
        unique : true ,
        lowercase : true, 
        required : true
},
slug: {
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
updatedBy:{
    type : Schema.Types.ObjectId,
    ref: 'User',
},
CreatedBy : {
    type : Schema.Types.ObjectId,
    ref: 'User',
    required : true         //Convert to true after adding the user
}


},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

CategorySchema.virtual('SubCategories',{
    localField:'_id',
    foreignField:'categoryId',
    ref : 'SubCategory'
})

const CategoryModel = model('Category' , CategorySchema);
export default  CategoryModel ;