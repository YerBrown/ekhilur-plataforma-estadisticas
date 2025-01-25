import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = mongoose.connection;
const DB_USER = process.env.MONGO_USER;
const DB_PASSWORD = process.env.MONGO_PASSWORD;
const DB_HOST = process.env.MONGO_HOST;
const DB_PORT = 27017;
const DB_NAME = process.env.MONGO_DATABASE;

async function connectDb() {
    try {
        await mongoose.connect(
            `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
        );
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.error(error);
    }
}
export default connectDb;
