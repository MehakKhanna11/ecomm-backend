import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility_class.js";
import { TryCatch } from "./error.js";



export const adminOnly=TryCatch(async(req,res,next)=>{
    const {id}=req.query;
    if(!id){
        return next(new ErrorHandler("Invalid ID!",401));
    }
    const user=await User.findById(id);
    if(!user){
        return next(new ErrorHandler("Admin not found",400));
    }
    if(user.role!=="admin"){
        return next(new ErrorHandler("Not a admin!",403));
    }
    next();
});


