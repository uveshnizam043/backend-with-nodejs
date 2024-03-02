import connectDB from "./db/index.js";
import dotenv from "dotenv";
import {app} from "./app.js";

dotenv.config({ path: "./env" });
connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port",${process.env.PORT}`);
    })
}).catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})







































// directly connecting db here not
// ;(async()=>{

//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
//         app.on("error",()=>{
//             console.log("Error in express js");
//             throw error

//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//     console.log("error while connect error",error);
//     }
// })()
