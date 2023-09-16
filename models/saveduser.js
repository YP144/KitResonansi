const mysql = require('mysql2');

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'testuser', // Ganti dengan username MySQL Anda
  password: 'iiot123', // Ganti dengan password MySQL Anda
  database: 'loginpage', // Ganti dengan nama database Anda
});

// // Terhubung ke database
// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Terhubung ke database MySQL');
// });

function saveUserData(userData) {
    return new Promise((resolve, reject) => {
      db.promise().query('INSERT INTO saveduser SET ?', userData)
        .then(([result]) => {
          console.log('Data berhasil disimpan');
          resolve(result);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

// function saveUserData(userData, callback) {
//   db.query('INSERT INTO saveduser SET ?', userData, (err, result) => {
//     if (err) {
//       console.log(err);
//       callback(err, null);
//       return;
//     }
//     console.log('Data berhasil disimpan');
//     callback(null, result);
//   });
// }

// Fungsi untuk mencari email yang sesuai dari database
const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM saveduser WHERE email = ?';
        db.query(query, [email], (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results[0]); // Mengembalikan pengguna pertama yang cocok (jika ada)
        });
      });
    };
  
// Fungsi untuk mencari id yang sesuai dari database
const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM saveduser WHERE id = ?';
        db.query(query, [id], (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results[0]); // Mengembalikan pengguna pertama yang cocok (jika ada)
        });
      });
    };

module.exports = {
    db,
  saveUserData,
  getUserByEmail,
  getUserById
};
