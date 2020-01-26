const mysql = require("mysql");
const inquirer = require("inquirer");
const { port, password, databaseName } = require('./config');

const connection = mysql.createConnection({
  host: "localhost",

  port: port,

  user: "root",

  password: password,
  database: databaseName
});
//left, inner, inner join for getting the employees and all relevant information
connection.connect(function(err) {
  if (err) throw err;
  console.log(`Your port is ${process.env.PORT}`);
  //function to run goes here
});