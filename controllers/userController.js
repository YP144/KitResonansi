// const orang = require("..//models/user") ;
// const express = require('express');
// const userController = express.Router();

// // const userController = {};

// /* GET HOME Page */

// userController.get('/',function(req,res){
//   res.render("login",{});
// });

// // userController.get('/tes',function(req,res){
// // res.json({test:"tes"})
// // })

// // userController.index=(req,res) => {
// //   res.render('login');
// // };

// // userController.submit=(req,res)=>{
// //   const { nama, NIM } = req.body;
  
// //   // Periksa apakah username dan password sesuai dengan yang ada di database
// //   User.get(nama,NIM, (err,user) => {
// //     if (err) {
// //       res.status(500).render('error', { message: err.message });
// //     } else if (user) {
// //       res.redirect('/dashboard');
// //     } else {
// //       res.render('login', { error: 'Nama dan NIM tidak benar' });
// //     }
// //   });
// // };



// // userController.post('/submit', function(req, res){
// //   // console.log('Router');
// //   orang.getUsers((err,rows) => {
// //     // console.log(rows);
// //     if(err){
// //       console.error(err.message);
// //     }else{
// //       const nama = rows.map(row => row.nama);
// //       const password = rows.map(row => row.password);
// //       const nim = rows.map(row => row.NIM);
// //       var datauser = [true, "Nama", "NIM", "Password"];
// //       var idxnama = 0;
// //       var namaada = false;
// //       for(var i = 0; i < nama.length;i++) {
// //         if(nama[i] == input_nama) {
// //           namaada = true;
// //           idxnama = i;
// //           break;}
// //       }
// //       for(var i = 0; i < password.length;){
// //         if(password[idxnama] == input_password){
// //           datauser[0] = true;
// //           datauser[1] = nama[idxnama];
// //           datauser[2] = nim[idxnama];
// //           datauser[3] = password[idxnama];
// //           pesan.textContent = 'Login berhasil!';
// //           pesan.style.color = 'green';
// //           res.send(JSON.stringify(datauser));
// //           res.redirect('/dashboard');
// //         }
// //         else{
// //           datauser[0] = false;
// //           datauser[1] = '-';
// //           datauser[2] = '-';
// //           datauser[3] = '-';
// //           pesan.textContent = 'Username atau password salah!';
// //           pesan.style.color = 'red';
// //           res.redirect('/');
// //         };
        
// //       };
      
// //     };
// //   });

// // });

// module.exports = userController;

const express = require('express');
const userController = express.Router();

/* GET HOME Page */

userController.get('/',checkNotAuthenticated,function(req,res){
  res.render("login",{});
});

userController.post("/login", checkNotAuthenticated, passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

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

module.exports = userController;