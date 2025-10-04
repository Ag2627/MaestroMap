import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/User.js";
import tripRoutes from "./routes/Trip.js";
import errorHandler from './middlewares/errorHandler.js';
import eventRoutes from "./routes/Events.js"
const app = express();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/myApi",eventRoutes);
// Error Handle
app.use(errorHandler);

export default app;
