import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cron from "node-cron";
import runScraper from "./Scrapper/Scrapper.js"


cron.schedule("0 0 * * *", () => {
  console.log("Running daily scraper...");
  runScraper();
});

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`MaestroMap server running on port ${PORT}`);
});
