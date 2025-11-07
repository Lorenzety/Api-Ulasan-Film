require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

// Ambil nama file DB dari .env (dengan fallback)
// const DB_MOVIES = process.env.DB_MOVIES || "movies.db";
// const DB_DIRECTORS = process.env.DB_DIRECTORS || "directors.db";

const DB_DIRECTORS = process.env.DB_DIRECTORS || "directors.db";

// ====== Koneksi ke movies.db ======
// const dbMovies = new sqlite3.Database(DB_MOVIES, (err) => {
//   if (err) {
//     console.error("Error connect ke movies.db:", err.message);
//     throw err;
//   } else {
//     console.log("Connected to movies.db");
    
//     dbMovies.run(`CREATE TABLE IF NOT EXISTS movies (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       title TEXT NOT NULL, 
//       director TEXT NOT NULL, 
//       year INTEGER NOT NULL
//     )`, (err) => {
//       if (!err) {
//         console.log("Table 'movies' created. Seeding initial data...");
//         const insert = 'INSERT INTO movies (title, director, year) VALUES (?,?,?)';
//         dbMovies.run(insert, ["The Lord of the Rings", "Peter Jackson", 2001]);
//         dbMovies.run(insert, ["The Avengers", "Joss Whedon", 2012]);
//         dbMovies.run(insert, ["Spider-Man", "Sam Raimi", 2002]);
//       }
//     });

//     dbMovies.run(`CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       username TEXT NOT NULL UNIQUE,
//       password TEXT NOT NULL
//     )`, (err) => {
//       if (err) {
//         console.error("Gagal membuat tabel users:", err.message);
//       }
//     });
//   }
// });


const dbDirectors = new sqlite3.Database(DB_DIRECTORS, (err) => {
  if (err) {
    console.error("Error connect ke directors.db:", err.message);
    throw err;
  } else {
    console.log("Connected to directors.db");

    dbDirectors.run(`CREATE TABLE IF NOT EXISTS directors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, 
      birthYear INTEGER
    )`, (err) => {
      if (!err) {
        console.log("Table 'directors' created. Seeding initial data...");
        const insert = 'INSERT INTO directors (name, birthYear) VALUES (?, ?)';
        dbDirectors.run(insert, ["Adelia Fioren Zety", 2005]);
        dbDirectors.run(insert, ["Intan Rahma Safira", 2005]);
        dbDirectors.run(insert, ["Husnul Alisah", 2005]);
      }
    });
     dbDirectors.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error("Gagal membuat tabel users:", err.message);
      }
    });
  }
});

module.exports = { dbDirectors };
// module.exports = { dbMovies };
