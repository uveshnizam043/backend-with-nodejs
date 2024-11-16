import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import setupSwagger from "../swagger.js";
const app = express()
const allowedOrigins = 'http://localhost:5173';

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
setupSwagger(app);


//routes import
import userRouter from './routes/user.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import textToSpeech from './routes/textToSpeech.routes.js'
import documentRoutes from './routes/document.routes.js'
import emailService from './routes/emailService.routes.js'


//routes declaration
app.use("/api/v1/users", userRouter)
// app.use("/api/v1/tweet", tweetRouter)
// app.use("/api/v1/tts", textToSpeech)
app.use("/api/v1/document", documentRoutes)
app.use("/api/v1/email", emailService)


export { app }