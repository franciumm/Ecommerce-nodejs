import {Schema, model} from "mongoose";


const UserSchema = Schema(
    {   firstName : String ,
        lastName : String ,
        userName : {  unique : [true ,'Email must be unique'],
            type : String,
            required :[true ,'UserName is required'] ,
            min:[2,'min length 2 char'],
            max:[20,'max length 20 char'],
        },
        email:{
            type : String,
            required :[true ,'Email must be typed'] ,
            unique : [true ,'Email must be unique']
                },
        password:{
                    type : String,
                    required :[true ,'password must be typed'] ,
            },
        phone : {
            type: String 
        },
        address : String , 
        age : Number,
        gender : {
            String,
            enum:['male','female']
        },
        role : {
            type : String ,
            default : 'User',
            enum:['Admin','User']
        },
        confirmEmail :{
            type : Boolean,
            default: false 
        },
        status : { 
            type : String ,
            default : 'offline',
            enum : ['offline' , 'online' , 'blocked' ]
        },
        
image:{
    secure_url:{
        type:String, 
        required:true
        },
    public_id :{
        type : String,
        required : true
    }}
    , 
    token : String,
    frogetPass:String
    }
);


export const UserModel = model('User', UserSchema);

