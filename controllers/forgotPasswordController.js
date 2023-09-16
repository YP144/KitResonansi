const express = require('express');
const forgotPasswordController = express.Router();

/* GET HOME Page */

forgotPasswordController.get('/',function(req,res){
  res.render("forgotpassword",{});
});

module.exports = forgotPasswordController;