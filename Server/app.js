import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/User.js"
import errorHandler from './middlewares/errorHandler.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/auth",authRoutes);

//Error Handle
app.use(errorHandler);


export default app;

