import mongoose from "mongoose";]
import { DB_NAME } from "./constant"
import express from "express";
const app=express()
;(async()=>{

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        app.on("error",()=>{
            console.log("Error in express js");
            throw error  
        
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
    console.log("error while connect error",error);    
    }
})()