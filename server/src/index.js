import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDb.js";
import router from "./routes/router.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requestLogger } from "./helpers/middleware.js";

dotenv.config();

const PORT = 3000;
const CLIENT_URL = process.env.CLIENT_URL;

const corsOptions = {
    origin: CLIENT_URL,
    credentials: true,
};

const app = express();
app.use(express.static("src/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(requestLogger);
app.use("/", router);

async function startServer() {
    await connectDb();
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
}

startServer();
