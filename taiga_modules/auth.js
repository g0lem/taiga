var jwt = require('jsonwebtoken');

var token_secret = "CKp2ZrcW8AndFdsSwZcudSur";



var auth = function(User){

	auth.User = User;

};

auth.prototype.logOut = function(res){
	res.clearCookie('sesid');
	//return "loggedOut";
}

auth.prototype.generateToken = function(obj){
	return jwt.sign(obj, token_secret); //change it to be random
}

auth.prototype.getToken = function(req){
	return req.cookies.sesid;
}

auth.prototype.getTokenData = function(req){
	return jwt.verify(req.cookies.sesid, token_secret);
}


auth.prototype.isAuth = function (req, res, next){

if( req.cookies.sesid ){
  auth.User.findOne({'sesstoken' : req.cookies.sesid}, function(err, user){
    if(err || user===null){
      res.redirect('/register');
    }
    else{
      res.cookie('username', user.screenname);
      next();
    }
  });
}
else
  res.redirect('/register');
}

module.exports = auth;