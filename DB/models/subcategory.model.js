import  {  model , Schema } from "mongoose";

const SubCategorySchema = new Schema({
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
    
    },slug: {
    type:String,
    unique : true ,
    lowercase : true, 
    required : true
},

CreatedBy : {
    type : Schema.Types.ObjectId,
    ref: 'User',
    required : true         //Convert to true after adding the user
},updatedBy:{
    type : Schema.Types.ObjectId,
    ref: 'User',       //Convert to true after adding the user
},
categoryId : {
    type: Schema.Types.ObjectId,
    ref : 'Category',
    required:true
}



},{
    toJSON:{virtuals:true},
toObject:{virtuals:true},
    timestamps:true
});

SubCategorySchema.virtual('Brands',{
    ref:'Brand',
    foreignField:'subCategoryId',
    localField:'_id'
})

export const SubCategoryModel = model('SubCategory' , SubCategorySchema);