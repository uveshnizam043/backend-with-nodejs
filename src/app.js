import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(cookieParser);
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

//when request come in json
app.use(
  express.json({
    limit: "32kb",
  })
);
//parse incoming request bodies in URL-encoded format.
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));
//CRUD operation on cookie
app.use(cookieParser())

export { app };
