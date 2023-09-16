// const sqlite3 = require('sqlite3').verbose()
// const DB_PATH = './database/data.db';

const mysql = require('mysql');
const connection = mysql.createConnection({
    host:'localhost',
    user: 'userk2iiot',
    password: 'iiot123',
    database: 'databasek2iiot',
});

class User {
  static getUsers(callback){
    // console.log('getUsers');
        
    connection.query('SELECT * FROM users',[], (err,rows)=>{
      callback(err,rows);
    });

    // static get(nama, NIM, callback) {
    //   const db = new sqlite3.Database(DB_PATH);
    //   db.get('SELECT * FROM login' , [], (err, row) => {
    //     callback(err, row);
    //   });
    //   // db.get('SELECT * FROM login WHERE nama = ? AND NIM = ?', [nama, NIM], (err, row) => {
    //   //   callback(err, row);
    //   // });
    //   db.close();
    // }
  };
};
  
  module.exports = User;
  
// const mqtt = require('mqtt');

// const client = mqtt.connect('mqtt://broker.example.com'); // Mengganti dengan alamat broker yang sesuai

// const topic = 'nilai_tombol'; // Mengganti dengan topik MQTT yang akan digunakan

// // Event handler saat tombol diklik atau aksi pengguna terjadi
// function handleButtonClick() {
//   const buttonValue = 'Nilai Tombol yang Dikirim'; // Mendapatkan nilai tombol yang ingin dikirim
//   client.publish(topic, buttonValue); // Terbitkan (publish) nilai tombol ke topik MQTT
// }

// // Mengaitkan event handler dengan elemen tombol
// const button = document.getElementById('myButton');
// button.addEventListener('click', handleButtonClick);
