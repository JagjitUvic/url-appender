const sqlite3 = require('sqlite3').verbose();

// Create and connect to the SQLite database file
const db = new sqlite3.Database('./links.db');

// Create the table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_url TEXT NOT NULL,
      parameters TEXT NOT NULL,
      final_url TEXT NOT NULL
    )
  `);
});

// Function to insert a new link into the DB
function insertLink({ original_url, parameters, final_url }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO links (original_url, parameters, final_url) VALUES (?, ?, ?)`,
      [original_url, JSON.stringify(parameters), final_url],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      }
    );
  });
}

// Function to fetch all stored links
function getAllLinks() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM links ORDER BY id DESC`, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Export our functions
module.exports = {
  insertLink,
  getAllLinks
};