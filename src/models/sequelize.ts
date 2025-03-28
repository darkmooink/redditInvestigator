import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "data/database.sqlite",
  logging: false, // Set logging to console.log or false
  define: {
    freezeTableName: true, // 👈 disables pluralization
  },
  dialectOptions: {
    timeout: 10000, // Increase timeout to 10s
  },
  retry: {
    match: [/SQLITE_BUSY/],
    name: 'query',
    max: 5, // Retry up to 5 times
    backoffBase: 100, // Initial backoff duration in ms
    backoffExponent: 1.5, // Exponential backoff factor
  },
});


export default sequelize;
