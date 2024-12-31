require("console-stamp")(console);
const config = require("config");
const mysql = require("mysql2");
const db_settings = config.get("db");
let pool;
let isPoolClosing = false;

try {
  pool = mysql.createPool(db_settings);
  pool.query("SELECT VERSION() as version, DATABASE() as db", (err, result) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      this.closePoolConnections();
    } else {
      console.log("Database connection successful:", result);
    }
  });
} catch (err) {
  console.error("Error creating database pool:", err);
}


module.exports.closePoolConnections = () => {
    if (isPoolClosing) return;  // Prevent multiple calls
    isPoolClosing = true;
    console.log("Closing pool connections");
    if (pool) {
        // Gracefully close the connection pool
        pool.end((error) => {
            if (error) {
                return console.error('Error closing pool:', error.message);
            }
            console.log('Connection pool successfully closed');
        });
    } else {
        console.log('No connection pool to close');
    }
};
