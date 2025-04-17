const express = require("express");
const app = express();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect:'postgres',
    host:process.env.DB_HOST,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    port:process.env.DB_PORT,
    schema:process.env.DB_SCHEMA,
    timezone: '+05:30',    
    logging: true, 
})  
sequelize.authenticate().then(() => {
  console.log('connected');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

module.exports = sequelize;
