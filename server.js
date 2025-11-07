require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbMovies, dbDirectors, dbUsers } = require('./database.js');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 3300;
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

app.use(cors());
app.use(express.json());

// === STATUS ROUTE ===
// app.get('/status', (req, res) => {
//   res.json({
//     status: 'OK',
//     message: 'Server is running',
//     timestamp: new Date()
//   });
// });

// === MOVIES ROUTES ===
// app.get('/movies', (req, res) => {
//   const sql = "SELECT * FROM movies ORDER BY id ASC";
//   dbMovies.all(sql, [], (err, rows) => {
//     if (err) return res.status(400).json({ error: err.message });
//     res.json(rows);
//   });
// });

// app.get('/movies/:id', (req, res) => {
//   const sql = "SELECT * FROM movies WHERE id = ?";
//   dbMovies.get(sql, [req.params.id], (err, row) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (!row) return res.status(404).json({ error: "Movie not found" });
//     res.json(row);
//   });
// });

// app.post('/movies', authenticateToken, (req, res) => {
//   const { title, director, year } = req.body;
//   if (!title || !director || !year) {
//     return res.status(400).json({ error: "title, director, and year are required" });
//   }

//   const sql = "INSERT INTO movies (title, director, year) VALUES (?, ?, ?)";
//   dbMovies.run(sql, [title, director, year], function (err) {
//     if (err) return res.status(500).json({ error: err.message });
//     res.status(201).json({ id: this.lastID, title, director, year });
//   });
// });

// app.put('/movies/:id', authenticateToken, (req, res) => {
//   const { title, director, year } = req.body;
//   dbMovies.run(
//     "UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?",
//     [title, director, year, req.params.id],
//     function (err) {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ updated: this.changes });
//     }
//   );
// });

// app.delete('/movies/:id', authenticateToken, (req, res) => {
//   dbMovies.run("DELETE FROM movies WHERE id = ?", [req.params.id], function (err) {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ deleted: this.changes });
//   });
// });

//=== DIRECTORS ROUTES ===
app.get("/directors", (req, res) => {
  dbDirectors.all("SELECT * FROM directors", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/directors/:id", (req, res) => {
  dbDirectors.get("SELECT * FROM directors WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Director not found" });
    res.json(row);
  });
});

app.post('/directors', authenticateToken, (req, res) => {
  const { name, birthyear } = req.body;
  const sql = "INSERT INTO directors (name, birthyear) VALUES (?, ?)";
  dbDirectors.run(sql, [name, birthyear], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, birthyear });
  });
});

app.put('/directors/:id', authenticateToken, (req, res) => {
  const { name, birthyear } = req.body;
  dbDirectors.run(
    "UPDATE directors SET name = ?, birthyear = ? WHERE id = ?",
    [name, birthyear, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

app.delete('/directors/:id', authenticateToken, (req, res) => {
  dbDirectors.run("DELETE FROM directors WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// === AUTH ROUTES ===
app.post('/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: 'Username dan password (min 6 char) harus diisi' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Gagal memproses pendaftaran' });

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    dbDirectors.run(sql, [username.toLowerCase(), hashedPassword], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Username sudah digunakan' });
        }
        return res.status(500).json({ error: 'Gagal mendaftarkan pengguna' });
      }
      res.status(201).json({ message: 'Registrasi berhasil', userId: this.lastID });
    });
  });
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi' });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  dbDirectors.get(sql, [username.toLowerCase()], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Kredensial tidak valid' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Kredensial tidak valid' });
      }

      const payload = { id: user.id, username: user.username };
      jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) return res.status(500).json({ error: 'Gagal membuat token' });
        res.json({ message: 'Login berhasil', token });
      });
    });
  });
});

// === HANDLE 404 ===
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// === START SERVER ===
app.listen(port, () => {
  console.log(`Server Running on localhost:${port}`);
});
