var express 	  = require('express');
var router 		  = express.Router();
var passport 	  = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose 		 = require('mongoose');
//var user = mongoose.model('user');

var User = require('../models/user');

// Register 
router.get('/register', function(req, res) {
  res.render('register');
});

router.get('/TPprofile', function(req, res) {
  res.render('TPprofile');
});

router.get('/TPservice', function(req, res) {
  res.render('TPservice');
});

router.get('/TPvalidation', function(req, res) {
  res.render('TPvalidation');
});

router.get('/TPdeclaration', function(req, res){
	res.render('TPdeclaration');
});

router.get('/TPpayment', function(req, res){
	res.render('TPpayment');
});



// Login 
router.get('/login', function(req, res) {
  res.render('login');
});

//profile
router.get('/profile', function(req, res){
	res.render('profile');
})




// Register User
router.post('/register', function(req, res) {

//insertRecord(req, res)

	var name 	  = req.body.name;
	var email 	  = req.body.email;
	var username  = req.body.username;
	var password  = req.body.password;
	var TIN=req.body.TIN;
	var phonenumber=req.body.phonenumber;
	var password2 = req.body.password2;

	// Validation
	req.assert('name','Name is required').notEmpty();
	req.assert('email','email is required').notEmpty();
	req.assert('email','email is not valid').isEmail();
	req.assert('username','username is required').notEmpty();
	req.assert('password','password is required').notEmpty();
	req.assert('phonenumber','phonenumber is required').notEmpty();
	req.assert('password2','passwords do not match').equals(req.body.password);


	var errors = req.validationErrors();
	if (errors) {
	  res.render('register',{
	  	errors : errors
	  });
	}else{
		
	  var newUser = new User({
	  	name 	 : name,
	  	email 	 : email,
			username : username,
			payment : 0,
			TIN: TIN,
			phonenumber: phonenumber,
			password : password
			
			//insertRecord(req, res)
		});

		//newuser.save((err, doc)=>{
		//	if (!err)
		//	console.log('hey');
		//	else{
		//		console.log('myman');
		//	}
		//});






	  User.createUser(newUser,function(err, user){
	  	if(err) throw err;
	  	console.log(user); 
	  	req.flash('success_msg','you are successfully register and can now log in');
	  	res.redirect('/users/login');
	  });
	}
});


//function insertRecord(req, res){
	//var newuser=new user();
	//newuser.name=req.body.name;
	//newuser.email=req.body.email;
	//newuser.username=req.body.username;
	//newuser.payment=req.body.payment;
	//newuser.TIN=req.body.TIN;
	

//}

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err,user){
    	if(err) throw err;
    	if(!user){
    		return(done(null, false, {message: 'unknown user'}));
    	}

    	User.comparePassword(password,user.password, function(err, isMatch){
    		if(err) throw err;
    		if(isMatch){
    			return done(null,user);
    		}else{
    			return(done(null, false, {message: 'invalid password'}));

    		}
    	});
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local',{successRedirect : '/users/profile', failureRedirect : 'back', failureFlash:true}),
  function(req, res) {
    res.redirect('/profile');
  });

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'you are logout');
	res.redirect('/users/login');
});

module.exports = router;
