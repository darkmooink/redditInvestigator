

const SORT_VALUES = ["new", "top", "hot", "rising", "controversial"] as const;
const TIME_RANGE_VALUES = ["hour", "day", "week", "month", "year", "all"] as const;
const ID_TYPE_VALUES = ["user", "subreddit", "id"] as const;
const CAN_USE_TIME_RANGE: SortOption[] = ["top", "controversial"];

type SortOption = (typeof SORT_VALUES)[number];
type TimeRangeOption = (typeof TIME_RANGE_VALUES)[number];
type IdTypeOption = (typeof ID_TYPE_VALUES)[number];

class RedditQueryOptions {
  sort: SortOption;
  limit: number;
  after: string;
  before: string;
  timeRange: TimeRangeOption;
  target!: Target;
  initialSettings:RedditQueryOptions

  

  constructor(init?: Partial<RedditQueryOptions>) {
    if (!init?.target){
      throw Error("no target")
    }
    this.target = init.target
    this.sort = init.sort??SORT_VALUES[0]
    this.limit = init.limit??100
    this.after = init.after??""
    this.before = init.before??""
    this.timeRange = init.timeRange??TIME_RANGE_VALUES[0]
    this.initialSettings = {...this}
    // console.log(this)
  }

  static getQueryForSubreddit(subreddit :string):RedditQueryOptions{
    return new RedditQueryOptions({
      target: new Target(subreddit, "subreddit"),
    });
  }

  static allSortValues(): SortOption[] {
    return [...SORT_VALUES];
  }

  static allTimeRangeValues(): TimeRangeOption[] {
    return [...TIME_RANGE_VALUES];
  }

  static allThingValues(): IdTypeOption[] {
    return [...ID_TYPE_VALUES];
  }

  geenerateURL():string{
    let url = "https://www.reddit.com";
    url += this.target.makeURLSection()
    url += "/" + this.sort
    url += ".json?"
    url += `limit=${this.limit}&after=${this.after}&before=${this.before}&t=${this.timeRange}`
    console.log(url)
    return url
  }

  next():boolean{
    let goToNextSortType = true
    this.after = ""
    if (CAN_USE_TIME_RANGE.includes(this.sort)) {
      const nextIndex = (TIME_RANGE_VALUES.indexOf(this.timeRange) + 1) % TIME_RANGE_VALUES.length;
      this.timeRange = TIME_RANGE_VALUES[nextIndex];
      if (this.timeRange != this.initialSettings.timeRange) {
        return true;
      }
    }
    if (goToNextSortType)  {
      const nextIndex = (SORT_VALUES.indexOf(this.sort)+1)%SORT_VALUES.length
      this.sort = SORT_VALUES[nextIndex]
      if (this.sort != this.initialSettings.sort){
        return true
      }
    }
    return false  
  }

}
class Target {
  resourceType: IdTypeOption;
  targetId: string;
  constructor(target: string, targetType: IdTypeOption) {
    this.targetId = target;
    this.resourceType = targetType
  }
  makeURLSection():string{
    let url = ""
    switch (this.resourceType){
      case "user":
        url += "/u";
        break;
      case "subreddit":
        url += "/r";
        break;
      case "id":
        url += "/by_id";
        break;
      default:
        throw new Error("invalid resource type, this should not be possible")
    }
    url += "/"+this.targetId
    return url
  }
}
export default RedditQueryOptions