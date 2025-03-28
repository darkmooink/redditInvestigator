import sequelize from "./sequelize";
import Post from "./Post";




async function initializeDatabase() {
  try {
    

    await sequelize.sync({ force: true });
    // await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
}

export { initializeDatabase, sequelize , Post}
