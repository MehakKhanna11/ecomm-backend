import mongoose from "mongoose";


const schema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter Name"]
    },
    photo:{
        type:String,
        required:[true,"Please enter Product Images"]
    },
    price:{
        type:Number,
        required:[true,"Please enter Product Price"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter Product Stock"]
    },
    category:{
        type:String,
        required:[true,"Please enter Product Category"],
        trim:true,
    },
},{timestamps:true});


export const Product=mongoose.model("Product",schema);