import express from "express";
import connectToMongo from "./connection/mongoConnect.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "https://ims-inventory-management-system-five.vercel.app/",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", userRouter);
app.use("/products", productRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
