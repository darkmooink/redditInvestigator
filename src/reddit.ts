import { randomInt } from "crypto";
import RedditQueryOptions from "./RedditQueryOptions";
import axios from "axios";
import Post from "./models/Post";

class RedditScraper {
  static lastFetchTime: number;
  static readonly minTimeBetweenFetches = 2000;
  static readonly timeToWaitToSeeIfFetchAvailible = 1000;

  private static async fetchURL(query: RedditQueryOptions): Promise<any> {
    while (
      Date.now() - RedditScraper.lastFetchTime <
      RedditScraper.minTimeBetweenFetches
    ) {
      console.log("Waiting to fetch...");
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          RedditScraper.timeToWaitToSeeIfFetchAvailible + randomInt(20)
        )
      );
    }
    RedditScraper.lastFetchTime = Date.now();

    const response = await axios.get(query.geenerateURL(), {
      headers: {
        "User-Agent": "myApp/1.0 by u/Mildly-Mischievous",
      },
    });
    const data = response;
    return data;
  }

  static async getAllFromSubreddit(subreddit: string) {
    const query = RedditQueryOptions.getQueryForSubreddit(subreddit)
    let hasMore = true
    while (hasMore){
        const response = await this.fetchURL(query)
        let posts = response.data.data.children
        console.log(`found ${posts.length} posts`)
        for (const post of posts){
            await Post.saveFromJson(post.data);
        }

        if (posts.length < query.limit){
            hasMore = query.next()
        }else{
            query.after = posts[posts.length-1].data.name
        }
    }
  }

}

export default RedditScraper