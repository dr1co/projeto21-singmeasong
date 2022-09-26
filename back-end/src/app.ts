import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import recommendationRouter from "./routers/recommendationRouter.js";
import testRouter from "./routers/testRouter.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/recommendations", recommendationRouter);
app.use(errorHandlerMiddleware);

if(process.env.MODE === "dev") {
    app.use(testRouter);
}

export default app;
