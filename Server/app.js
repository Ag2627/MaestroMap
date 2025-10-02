import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/User.js";
import tripRoutes from "./routes/Trip.js";
import errorHandler from './middlewares/errorHandler.js';

const app = express();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trip", tripRoutes);

// Error Handle
app.use(errorHandler);

export default app;
