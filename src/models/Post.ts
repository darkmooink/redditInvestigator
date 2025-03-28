import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import { error } from "console";

class Post extends Model {
  public id!:string;
  public title!:string;
  public author!:string;
  public content!:string;
  public subredditId!:string;
  public updated!:number
  public json!:any[]

  public static async saveFromJson(data:any):Promise<Post>{
    // console.log(`trying to save ${data.name}`)
    if (!data.name){
      throw error(`tried to process a post without a name ${data}`)
    }else if (data.name[1] != 3 ){
      throw error(`tried to process ${data.name} as a post`)
    }
    const existing = await Post.findOne({
      where: { id: data.name }
    });
    if (existing) {
      if (existing.updated != data.edited) {
        await existing.update({
          content: data.selftext,
          updated: data.edited,
          json: Array.isArray(existing.json)
            ? [data, ...existing.json]
            : [data],
        });
      }
      return existing;

    } else {
      const newPost = await Post.create({
        id: data.name,
        title: data.title,
        content: data.selftext,
        author: data.author,
        subredditId: data.subreddit_id,
        updated: data.edited,
        json: [data]
      });
      return newPost;
    }
  }
}

Post.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    author: DataTypes.STRING,
    subredditId: DataTypes.STRING,
    updated: DataTypes.NUMBER,
    json: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  { sequelize, modelName: "Post" }
);

export default Post;