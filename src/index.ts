import './models/index'; // Import the central models file
import { initializeDatabase, sequelize } from './models/index';
import RedditScraper from "./reddit";



async function run() {
  initializeDatabase()
  RedditScraper.getAllFromSubreddit("all");
}

if (require.main === module) {
  setTimeout(() => {console.log("Timeout done!"); run()}, 1000);
}
