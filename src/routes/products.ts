import express from "express"
import { adminOnly } from "../middlewares/auth.js";
import { deleteProduct, getAdminProducts, getAllCategories, getLatestProducts, getProductDetails, newProduct, searchProducts, updateProductDetails } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";


const app=express.Router();

//api/v1/product
app.post("/new",adminOnly,singleUpload,newProduct);

app.get("/latest",getLatestProducts);

//filters
app.get("/all",searchProducts);

app.get("/categories",getAllCategories);

app.get("/admin-products",adminOnly,getAdminProducts);

app.route("/:id").get(getProductDetails).put(adminOnly,singleUpload,updateProductDetails).delete(adminOnly,deleteProduct);

export default app;
