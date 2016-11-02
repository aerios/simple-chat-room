var express = require('express');
var SocketServer = require("../libs/SocketServer")
var router = express.Router();

router.get('/', function(req, res, next) {
 	res.redirect('/users/login');
});

router.get("/login", function (req, res, next) {

	if( req.session.userId ){return res.redirect("/home")}
	res.render('users/login', {
		title : "Login"
	})
})

router.get("/logout", function( req, res) {
	var userData = req.session.userData
	req.session.destroy(function() {
		var IO = SocketServer.getIO()
		IO.emit("user.leave",userData)
		res.redirect("/users/login")	
	})	
})

router.post("/login", function( req, res, next) {
	if(req.session.userId){return res.redirect("/home")}
	var username = req.body.username;
	var password = req.body.password;
	var userId = [username,password].join(":::")
	var userData = {
		user_id : userId,
		username : username,
		timestamp : new Date().getTime()
	}
	req.session.userId = userId
	req.session.userData = userData
	var IO = SocketServer.getIO()
	IO.emit("user.join",userData)
	res.redirect("/home")
})

module.exports = router;
