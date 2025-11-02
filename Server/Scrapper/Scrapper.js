import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import Event from '../models/Event.js';

puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- SIMPLIFIED FUNCTION TO GET ONLY NAME, DATE, TIME, and LOCATION ---
async function scrapeEventDetails(page, eventUrl) {
    try {
        await page.goto(eventUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for the main container of date, time, and location
        const sectionSelector = 'div[id="datetime-location-section"]';
        await page.waitForSelector(sectionSelector, { timeout: 20000 });

        const eventData = await page.evaluate((url) => {
            const getText = (selector) => document.querySelector(selector)?.innerText.trim() || null;
            
            // These are new selectors based on the current website structure
            const name = getText('h1.eps-heading-1');
            if (!name) return null;

            // The date and time are in the first paragraph of the section
            const dateTimeString = getText('div[id="datetime-location-section"] p');

            // The location/venue is in the second paragraph
            const locationString = document.querySelectorAll('div[id="datetime-location-section"] p')[1]?.innerText.trim();

            return {
                name,
                dateTime: dateTimeString,
                location: locationString,
                url: url, // We still need the URL to avoid duplicates
            };
        }, eventUrl);

        return eventData;

    } catch (error) {
        console.error(`❌ Failed to scrape details for URL ${eventUrl}:`, error.message);
        return null;
    }
}


// Main function
export async function scrapeAllEvents(city = "new-delhi") {
    console.log(`🚀 Starting FINAL scrape for ${city}...`);
    const browser = await puppeteer.launch({
        headless: true, 
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    try {
        await page.setViewport({ width: 1366, height: 768 });

        const listUrl = `https://allevents.in/${city}`;
        await page.goto(listUrl, { waitUntil: "networkidle2", timeout: 60000 });

        const eventItemSelector = 'li.event-card-link';
        await page.waitForSelector(eventItemSelector, { timeout: 30000 });
    

        const uniqueUrls = new Set(await page.$$eval(eventItemSelector, (items) =>
            items.map(item => item.getAttribute('data-link')).filter(url => url)
        ));
        
        console.log(`🔎 Found ${uniqueUrls.size} unique event URLs for ${city}.`);
        if (uniqueUrls.size === 0) return;

        for (const url of uniqueUrls) {
            const details = await scrapeEventDetails(page, url);
            if (details) {
                // --- MAP THE SIMPLE DATA TO YOUR SCHEMA BEFORE SAVING ---
                 let parsedDate;
                    if (details.dateTime) {
                        // Try to extract a clean date string
                        let dateString = details.dateTime.split(' at ')[0].split('-')[0].trim();
                        if (!/\d{4}/.test(dateString)) { // Add the current year if not present
                            dateString += `, ${new Date().getFullYear()}`;
                        }
                        parsedDate = new Date(dateString);
                    }

                    // THE SAFETY CHECK: If the date is invalid, skip this event
                    if (!parsedDate || isNaN(parsedDate.getTime())) {
                        console.warn(`🟡 Skipping event "${details.name}" due to unparsable date: "${details.dateTime}"`);
                        continue; // This jumps to the next event in the loop
                    }

                const eventToSave = {
                    name: details.name,
                    description: `Date and Time: ${details.dateTime}`, // Store dateTime in description
                    venue: {
                        name: details.location,
                        city: city.charAt(0).toUpperCase() + city.slice(1),
                    },
                    startDate: details.dateTime ? new Date(details.dateTime.split('at')[0]) : new Date(),
                    url: details.url,
                    source: 'AllEvents.in (Scraped)',
                };

                await Event.findOneAndUpdate({ url: eventToSave.url }, eventToSave, { 
                    upsert: true, new: true, setDefaultsOnInsert: true 
                });
                console.log(`💾 Saved event: ${eventToSave.name}`);
            }
            await delay(500);
        }

        console.log(`✔️ Scraping finished for ${city}.`);
    } catch (error) {
        console.error(`❌ Main Puppeteer process failed for ${city}: ${error.message}`);
    } finally {
        console.log('Closing browser...');
        await browser.close();
    }
}
export default async function runScraper() {
 const cities = ["new-delhi", "mumbai", "bangalore", "kolkata", "chennai"];
// add more cities as needed

  for (const city of cities) {
    console.log(`\n🚀 Starting scraping for city: ${city}`);
    await scrapeAllEvents(city);

    // Optional: wait 3-5 seconds before next city to be polite
    await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 2000));
  }

  console.log("✅ All cities scraped.");
}

// Run the scraper
runScraper();