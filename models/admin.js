var mongoose = require('mongoose');
var	Schema 	 = mongoose.Schema;
var bcrypt   = require('bcryptjs');




var AdminSchema = new Schema({

	username: {
		type: String,
		index:true
	},

	password: {
		type: String
	},

	email: {
		type: String
	},

	name: {
		type: String
	}
});

var Admin = module.exports = mongoose.model('admin',AdminSchema);

module.exports.createAdmin = function(newAdmin, callback){
	
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newAdmin.password, salt, function(err, hash) {
	        // Store hash in your password DB. 
	        newAdmin.password = hash;
	        newAdmin.save(callback);
	    });
	});
};

module.exports.getAdminByUsername = function(username,callback){
	var query = {username : username};
	Admin.findOne(query,callback);
};

module.exports.getAdminById = function(id,callback){
	Admin.findById(id,callback);
};

module.exports.comparePassword = function(passwordTyped, hash, callback){
	// Load hash from your password DB. 
	bcrypt.compare(passwordTyped, hash, function(err, isMatch) {
		if(err) throw err;
		callback(null,isMatch);
	});
}	