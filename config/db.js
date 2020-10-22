let mysql = require("mysql");
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "anti-regime",
});

connection.connect();

module.exports = connection;
