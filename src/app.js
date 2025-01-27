import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN, // prigin link of our frontend
        credentials: true, // allows express to take our credentials
    })
);

app.use(express.json({ limit: "16kb" })); // Controls the maximum request body size
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Returns middleware that only parses urlencoded bodies
app.use(express.static("public")); //This is a built-in middleware function in Express. It serves static files and is based on serve-static.
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter)

//https://localhost:8000/api/v1/users/register this is the url for user registration

export { app };
