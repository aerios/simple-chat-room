var express = require('express');
var router = express.Router();

router.get("/", function (req,res) {
	if( req.session.userId ){		
		var session = req.session
		var userId = session.userId
		var userData = session.userData
		res.render("home",{
			title : "Home",
			user: {
				id : userId,
				username : userData.username,
				timestamp : userData.timestamp
			}
		})	
	} else {
		res.redirect("/users/login")
	}
	
})

module.exports = router