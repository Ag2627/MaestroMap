import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';


connectDB();

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`MaestroMap server running on port ${PORT}`);
// });
// console.log(process.env.MONGO_URI)
export default app;