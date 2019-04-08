const express=require('express');
var router=express.Router();
const LocalStrategy=require('passport-local').Strategy;
const passport=require('passport');
var mongoose 		 = require('mongoose');
//var user = mongoose.model('user');
//var User = require('../models/user');
var app = express();

//app.runMiddleware('/AdminRegister', {method:'post'}, function(code, body, headers){
  //console.log(code);
//})








var Admin = require('../models/admin');

// add new admin
router.get('/AdminRegister', (req,res) => {
    res.render('AdminRegister', {layout:'adminlayout.handlebars'});
     });

// admin login
router.get('/adminlogin', (req,res) => {
    res.render('adminlogin', {layout:'adminlayout.handlebars'});
     });

     

       router.get('/admindashboard', (req,res) => {
        res.render('admindashboard', {layout:'adminlayoutii.handlebars'});
         });





         router.get('/admintable', (req,res) => {
          res.render('admintable', {layout:'adminlayoutii.handlebars'});
          });



  
  
  // Register User
  router.post('/AdminRegister', function(req, res) {
      var name 	  = req.body.name;
      var email 	  = req.body.email;
      var username  = req.body.username;
      var password  = req.body.password;
      var password2 = req.body.password2;
  
      // Validation
      req.assert('name','Name is required').notEmpty();
      req.assert('email','email is required').notEmpty();
      req.assert('email','email is not valid').isEmail();
      req.assert('username','username is required').notEmpty();
      req.assert('password','password is required').notEmpty();
      req.assert('password2','passwords do not match').equals(req.body.password);
  
  
      var errors = req.validationErrors();
      if (errors) {
        res.render('AdminRegister',{
            errors : errors
        });
      }else{
          
        var newAdmin = new Admin({
            name 	 : name,
            email 	 : email,
            username : username,
            password : password
        });
  
        Admin.createAdmin(newAdmin,function(err, admin){
            if(err) throw err;
            console.log(admin); 
            req.flash('success_msg','you are successfully register and can now log in');
            res.redirect('/admins/adminlogin');
        });
      }
  });

  
  
 // passport.use(new LocalStrategy(
   // function(username, password, done) {
     // Admin.getAdminByUsername(username, function(err,admin){
       //   if(err) throw err;
         // if(!admin){
           //   return(done(null, false, {message: 'unknown admin'}));
          //}
  //
    //      Admin.comparePassword(password,admin.password, function(err, isMatch){
      //       if(err) throw err;
        //      if(isMatch){
          //       return done(null,admin);
            //}else{
              //    return(done(null, false, {message: 'invalid password'}));
  
  //            }
    //      });
     // });
   // }
 // ));


  
 // passport.serializeUser(function(admin, done) {
   // done(null, admin.id);
  //});
  
 // passport.deserializeUser(function(id, done) {
   // User.getAdminById(id, function(err, admin) {
     // done(err, admin);
   // });
 // });
  
  router.post('/adminlogin',
   // passport.authenticate('local',{successRedirect : '/admins/admindashboard', failureRedirect : 'back', failureFlash:true}),
    function(req, res) {
      Admin.getAdminByUsername(req.body.username, (err,admin)=>{
        if(!admin)
                res.render('adminlogin', {error: "User does not exist"})
            else
     
      res.redirect('/admins/admindashboard');
    })
    });
  
  router.get('/adminlogout', function(req, res){
      req.adminlogout();
      req.flash('success_msg', 'you are logout');
      res.redirect('/admins/adminlogin');
  });


     module.exports=router;