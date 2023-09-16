// applications
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mqtt = require('mqtt');
const mysql = require('mysql2');
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const { db, saveUserData, getUserByEmail, getUserById } = require('./models/saveduser.js');
const passport = require("passport");
const initializePassport = require("./passport-config");
initializePassport(passport,getUserByEmail,getUserById);
let dataInOut = false;
const port = 144;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

// // routers
// const loginRouter = require('./controllers/userController');
// const dashboardRouter = require('./controllers/dashboardController');
// const registerRouter = require('./controllers/registerController');
// const forgotPasswordRouter = require('./controllers/forgotPasswordController');

// const userController = require('./controllers/userController');
// const dashboardController = require('./controllers/dashboardController')

// setup view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: 'yes',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Setup static files
app.use(express.static(path.join(__dirname, 'public')));

// Setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use('/',loginRouter);
// app.use('/dashboard',dashboardRouter);
// app.use('/register',registerRouter);
// app.use('/forgotpassword',forgotPasswordRouter);

// // error handling
// app.use((req,res,next)=>{
//     res.status(404).render('error',{message:"page not found"});
//     console.log("page not found");
// })

// app.use((err,req,res,next)=>{
//     res.status(500).render('error',{message:err.message});
//     console.log("error 500");
// })
// Eksekusi query dan mengekspor ke file XLSX
function exportToXLSX(callback) {
    connection.query('SELECT * FROM data', (err, results, fields) => {
      if (err) {
        console.error('Error executing query:', err);
        callback(err);
        return;
      }
  
      // Mengonversi hasil query menjadi format yang diperlukan oleh xlsx
      const data = results.map(row => Object.values(row));
      const header = fields.map(field => field.name);
      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Praktikum');
  
      // Menyimpan file XLSX
      const filename = 'praktikum_data.xlsx';
      const filePath = path.join(__dirname, '/public', filename);
      XLSX.writeFile(workbook, filePath);
  
      console.log(`Tabel berhasil diekspor ke file ${filename}`);
      callback(null, filePath);
    });
  }


const connection = mysql.createConnection({
    host:'localhost',
    user: 'testuser',
    password: 'iiot123',
    database: 'livegrafik'
});
connection.connect((error) =>{
    if (error){
        console.error('Koneksi ke database gagal: '+ error.stack);
        return;
    }

    console.log('Terhubung ke database MySQL dengan ID koneksi '+ connection.threadId);
});

// start server

const topicPiston = 'stepper_move';
// Variabel untuk menyimpan nilai topic
let topicValue = 0;
const mqttBroker = 'mqtt://iot.tf.itb.ac.id:1883'; // Ganti dengan alamat dan port MQTT broker Anda
const client = mqtt.connect(mqttBroker);

client.on('connect',function(){
    // Subscribe ke lebih dari 1 topik
    const topicsToSubscribe = ['db', 'tube_length','stepper_move']; // Ganti dengan topik-topik MQTT yang ingin Anda subscribe
    topicsToSubscribe.forEach(topic => {
        client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Gagal subscribe ke topik ${topic}: ${err}`);
            } else {
                console.log(`Berhasil subscribe ke topik ${topic}`);
             }
        });
    });

});


io.on('connection', (socket) => {
    console.log('Klien terhubung');

    socket.on('buttonClick', (value) => {
    
        client.publish(topicPiston, value, (err) => {
            if (err) {
                console.error('Tombol Kontrol Piston gagal terhubung ke MQTT broker:', err);
            }
        });
    });

    socket.on('ResetData', (value) => {
      
        // fungsi berisi syntax template untuk memasukan data ke tabel database
        const query = `
        TRUNCATE TABLE data
        `;

        //memanggil fungsi syntax template sebelumnya
        connection.query(query,function(err){
            if(err){
                console.error(err.message);
            } else {
                console.log(`Reset Database Berhasil`);
            }
        });
    });

    // Event handler saat tombol ditekan
    socket.on('exportData', () => {
        exportToXLSX((err, filePath) => {
        if (err) {
            console.error('Error exporting data:', err);
            return;
        }
        // Mengirim file XLSX sebagai respon ke client
        socket.emit('downloadFile', filePath);
        });
    });

    socket.on('getData', (value) => {
        // console.log(` getData: ${}`);
        if (value === '1'){
            dataInOut = true;
            console.log(` getData: ${value}`);

        } else if(value === '0'){
            dataInOut = false;
            // console.log(` data stopped `);
            console.log(` getData: ${value}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('Klien terputus');
    });
});

let datadb = 0;
let dataTubeLength = 0;
let dataBtn = 0;
let statusBtn = 'Diam'
client.on('message',function(topic,message){
    const data = message.toString();
    if(dataInOut){
        console.log(` data started `);
        console.log(`Menerima data dari topik ${topic}:`, data);
    
        if(topic==='db'){
            datadb = data;
            console.log(data);
            io.emit('valuedb', parseFloat(data)); // Kirim nilai topic ke semua client terhubung
            // fungsi berisi syntax template untuk memasukan data ke tabel database
            const query = `
                INSERT INTO data(y1,y2,btn)
                VALUES(?,?,?)
                `;
          
            const values = [datadb,dataTubeLength,statusBtn];
  
            //memanggil fungsi syntax template sebelumnya
            connection.query(query,values,function(err){
                if(err){
                    console.error(err.message);
                } else {
                    console.log(`inserted data: ${datadb} || ${dataTubeLength} || ${statusBtn}`);
                }
            });          
        } else if(topic==='tube_length'){
            dataTubeLength = data;
            console.log(data);
            io.emit('valueTubeLength', parseFloat(data));
            // fungsi berisi syntax template untuk memasukan data ke tabel database
            const query = `
                INSERT INTO data(y1,y2,btn)
                VALUES(?,?,?)
                `;
          
            const values = [datadb,dataTubeLength,statusBtn];
  
            //memanggil fungsi syntax template sebelumnya
            connection.query(query,values,function(err){
                if(err){
                    console.error(err.message);
                } else {
                    console.log(`inserted data: ${datadb} || ${dataTubeLength} || ${statusBtn}`);
                }
            });      
        };
    } else if (!dataInOut){
        console.log(` data stopped `);
    }
    if(topic==='stepper_move'){
        dataBtn = data;
        console.log(data);
        io.emit('valueBtn', parseInt(dataBtn));
        if(data == '0'){
            statusBtn = 'Diam';
        } else if(data == '1'){
            statusBtn = 'Maju';
        } else if(data == '2'){
            statusBtn = 'Mundur';
        }     
    };
});

// Rute untuk ke dashboard
app.get('/', (req, res) => {
    res.render('index');
  });

// Rute untuk ke dashboard
app.get('/home', (req, res) => {
    res.render('home');
  });
 
app.get("/dashboard", checkAuthenticated, async (req, res) => {
    try {
      // Menunggu Promise req.user diselesaikan dan mengakses properti "nama"
      const user = await req.user;
      res.render("dashboard.ejs", { name: user.nama });
    } catch (error) {
      // Tangani jika ada error saat menyelesaikan Promise
      console.error('Terjadi kesalahan:', error);
      res.status(500).send('Terjadi kesalahan dalam mengambil data pengguna.');
    }
  });

app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req,res) => {
    //try{
        //const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = { 
            nama:req.body.name,
            email:req.body.email,
            password:req.body.password };

        saveUserData(userData)
            .then((result) => {
                console.log('Data berhasil disimpan ke database:', result);
                console.log(userData);
                res.redirect('/');
                })
            .catch((error) => {
                  console.error('Terjadi kesalahan menyimpan ke database:', error);
                  res.redirect('/register');
                });
    // } catch{
    //     res.redirect('/login');
    // }
});

app.post("/login", checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
}));

app.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
          // Tangani kesalahan jika terjadi
          console.log(err);
          return res.status(500).send('Internal Server Error');
        }
        // Logika setelah pengguna keluar
        // Misalnya, arahkan pengguna ke halaman utama atau tampilkan pesan sukses
        res.redirect('/');
      });
});





function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next(); 
}


http.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
});


