// const dotenv = require('dotenv');
// dotenv.config();
// // utils/sql.js
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(process.env.DB_URL, {
//   dialect: 'postgres', // or 'mysql', 'sqlite'
//   logging: false, // disable logging
// });

// module.exports = sequelize;

const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  development: {
    url: process.env.DB_URL,
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true } },
  },
}