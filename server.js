const mysql = require("mysql");
const inquirer = require("inquirer");
const { port, password, databaseName } = require('./config');

console.log(password);
console.log(port);
console.log(databaseName);

const connection = mysql.createConnection({
  host: "localhost",

  port: port,

  user: "root",

  password: password,
  database: databaseName
});

connection.connect(function(err) {
  if (err) throw err;
  console.log(`Your port is ${process.env.PORT}`);
  //function to run goes here
});