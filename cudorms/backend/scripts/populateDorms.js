import axios from "axios";
import scrapeDorms from "../scraper/dormScraper.js";
(async function populateDorms() {
  try {
    const dorms = await scrapeDorms();
    const apiEndpoint = "http://localhost:4000/dorms";
    for (const dorm of dorms) {
      try {
        const formatted = {
          name: dorm.name,
          description: dorm.summary
        }
        console.log(formatted);
        const response = await axios.post(apiEndpoint, formatted);
        console.log(`Dorm added: ${response.data.name}`);
      } catch (error) {
        console.error(`Failed to add dorm: ${dorm.name}`, error.message);
      }
    }
  } catch (error) {
    console.error("Error populating dorms:", error.message);
  }
})();