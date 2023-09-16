const express = require('express');
const registerController = express.Router();

/* GET HOME Page */

registerController.get('/',checkNotAuthenticated,function(req,res){
  res.render("register",{});
});

registerController.post("/register", checkNotAuthenticated, async (req,res) => {
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
              res.redirect('/login');
              })
          .catch((error) => {
                console.error('Terjadi kesalahan menyimpan ke database:', error);
                res.redirect('/login');
              });
  // } catch{
  //     res.redirect('/login');
  // }
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

module.exports = registerController;