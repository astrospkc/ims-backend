import express from "express";
import connectToMongo from "./connection/mongoConnect.js";
import userRouter from "./routes/userRoutes.js";
import dotenv from "dotenv";
dotenv.config();
connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", userRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
