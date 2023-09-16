// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('data.db');

const mysql = require('mysql');
const mqtt = require('mqtt');

const connection = mysql.createConnection({
    host:'iot.tf.itb.ac.id',
    user: 'userk2iiot',
    password: 'iiot123',
    database: 'databasek2iiot'
});

connection.connect((error) =>{
    if (error){
        console.error('Koneksi ke database gagal: '+ error.stack);
        return;
    }

    console.log('Terhubung ke database MySQL dengan ID koneksi '+ connection.threadId);
});

const client = mqtt.connect('mqtt://iot.tf.itb.ac.id:1883');

client.on('connect',function(){
    client.subscribe('users');
});

// client.on('message',function(topic,message){
//     const data = JSON.parse(message.toString());

//     if(topic==='temperature'){
//         // fungsi berisi syntax template untuk memasukan data ke tabel database
//         const query = `
//             INSERT INTO temperature(timestamp,value)
//             VALUES(?,?)
//         `;
        
//         const values = [data.timestamp,data.value];

//         //memanggil fungsi syntax template sebelumnya
//         connection.query(query,values,function(err){
//             if(err){
//                         console.error(err.message);
//                     } else {
//                         console.log(`inserted time series data:${data.timestamp} ${data.value}`);
//                     }
//             });
        
//         // // bisa juga secara langsung ga perlu template kayak gini
//         // connection.query('SELECT * FROM temperature', (error, results) => {
//         //     if (error) {
//         //         console.error('Error saat mengeksekusi query: ' + error.stack);
//         //         return;
//         //     }
              
//         //     console.table(results);
//         //     });
              
              
//     };
// });

// const sqlite3 = require('sqlite3').verbose();
// const mqtt = require('mqtt');
// const db = new sqlite3.Database('./database/data.db');

// const client = mqtt.connect('mqtt://localhost:1883');

// client.on('connect',function(){
//     client.subscribe('temperature');
// });

// client.on('message',function(topic,message){
//     const data = JSON.parse(message.toString());

//     if(topic==='temperature'){
//         const query = `
//             INSERT INTO temperature(timestamp,value)
//             VALUES(?,?)
//         `;
        
//         const values = [data.timestamp,data.value];

//         db.run(query,values,function(err){
//             if(err){
//                 console.error(err.message);
//             } else {
//                 console.log(`inserted time series data:${data.timestamp} ${data.value}`);
//             }
//         });
//     } 
// });