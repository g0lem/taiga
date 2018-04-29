var bcrypt = require('bcryptjs');
var basic = require("./basic_functions");
var uuid = require('node-uuid');
var nodemailer = require('nodemailer');

module.exports = function(app, auth, mongoose){

  var User = mongoose.model('User');

  //***Account Creation***
  app.post('/creating', function (req, res){

    var userdata = req.body;
    if(userdata.username&&userdata.password&&userdata.passwordVerif){
      if(userdata.password == userdata.passwordVerif){
        passwordVerifyString = basic.passwordRegex(userdata.password);
        usernameVerifyString = basic.usernameRegex(userdata.username);
        emailVerifyString = basic.emailRegex(userdata.email);

        if(usernameVerifyString != "ok"){
          res.send(usernameVerifyString);
        }
        else if(passwordVerifyString != "ok"){
                res.send(passwordVerifyString);
        }
        else if(emailVerifyString != "ok"){
                res.send(emailVerifyString);
        }
        else {
          userdata.password = userdata.password.trim().replace(/\\(.)/mg); //Impossible to have "\" but better safe than sorry.
          var salt = bcrypt.genSaltSync(10);
          var hashedPassword = bcrypt.hashSync(userdata.password, salt);
          var escapedUsername = basic.escapeRegExp(userdata.username);
          var escapedEmail = basic.escapeRegExp(userdata.email);

          User.find({ username: escapedUsername.toLowerCase() },function(err,data){
            if(err){
              console.log(err);
            }
            if(data.length!=0){
              res.send("Username already exists!");
            }
            else {
              
              //Generate Token 
                      
              var today = new Date();
              var exp = new Date(today);
              exp.setDate(today.getDate() + 60);

              var token = auth.generateToken({
                ip: req.connection.remoteAddress,
                username:  userdata.username,
                exp: parseInt(exp.getTime() / 1000),
              });

              var user_account_activation_hash = uuid.v4();

              res.cookie('sesid', token);

              //End generate token
                var userInsertObject = new User({ username: escapedUsername.toLowerCase() , screenname: escapedUsername, email: escapedEmail.toLowerCase(), account_activation_hash: user_account_activation_hash, password: hashedPassword, sesstoken: token });
                userInsertObject.save();
                res.send("Account created!");

              // create reusable transporter object using the default SMTP transport
              // var transporter = nodemailer.createTransport({
              //     service: 'gmail',
              //     auth: {
              //         user: 'saserb@gmail.com',
              //         pass: ''
              //     }
              // });

              // // setup email data with unicode symbols
              // var mailOptions = {
              //     from: '"Taiga Team" <noreply@taigachat.com>', // sender address
              //     to: userdata.email, // list of receivers
              //     subject: 'Account Activation', // Subject line
              //     text: 'Click here to activate account', // plain text body
              //     html: '<a href="taigachat.com/graph/activateAccount/'+user_account_activation_hash+'">Click here to activate account</a>' // html body
              // };

              // // send mail with defined transport object
              // transporter.sendMail(mailOptions, (error, info) => {
              //     if (error) {
              //         return console.log(error);
              //     }
              //     else{
              //       console.log('Message %s sent: %s', info.messageId, info.response);
              //       var userInsertObject = new User({ username: escapedUsername.toLowerCase() , screenname: escapedUsername, email: escapedEmail.toLowerCase(), account_activation_hash: user_account_activation_hash, password: hashedPassword, sesstoken: token });
              //       userInsertObject.save();
              //       res.send("Account created!");
              //     }
              // });

              
            }
          });
        }
      }
      else {
        res.send("Passwords don't match.");
      }
    }
    else{
      res.send("Don't leave the fields empty!");
    }
  });
  //***Account Creation***



  //***Account Sessions***
  app.post('/loggingIn', function (req, res){

    var userdata=req.body;


    if(userdata.password&&userdata.username){

      var escapedUsername = basic.escapeRegExp(userdata.username);
    
      User.findOne({ username: userdata.username.toLowerCase() },function(err,data){

      if(err){
        console.log(err);
      }

        if(data==undefined){
            res.send("Account doesn't exist!")
        }
        else {
          bcrypt.compare(userdata.password,data.password, function(err, pwdcheck){
            if(err){
                console.log(err);
            }
            if(pwdcheck){
              
              //Generate Token 
              var today = new Date();
              var exp = new Date(today);
              exp.setDate(today.getDate() + 60);
              var token = auth.generateToken({
                ip: req.connection.remoteAddress,
                username:  userdata.username,
                exp: parseInt(exp.getTime() / 1000),
              });
              res.cookie('sesid', token);
              data.sesstoken=token;
              data.save();
              //End generate token

              res.send("Logged in.");//To be replaced with actual logging in
            }
            else {
              res.send("Username and password do not match.");
            }
          });
        }
      });
    }
    else {
          res.send("Don't leave the fields empty!");
    }
  });
  //***Account Sessions***


  //***Account Management***
  app.post('/changePassword', function (req, res){

    var userdata = req.body;
    var cookie_data = auth.getTokenData(req); 

    if(userdata.verify1 != userdata.verify2 && userdata.new1 != userdata.new2){
      res.send("passwords don't match");
      return;
    }
    else if(userdata.new1 && cookie_data.username){ //Fix this security issue

      var escapedUsername = basic.escapeRegExp(cookie_data.username);

      User.findOne({ username: cookie_data.username.toLowerCase(), sesstoken: req.cookies.sesid },function(err,data){
        if(err){
          console.log(err);
        }
        else {
          bcrypt.compare(userdata.verify1, data.password, function(err, pwdcheck){
            console.log(pwdcheck);
            if(pwdcheck){

              userdata.new1 = userdata.new1.trim().replace(/\\(.)/mg); //Impossible to have "\" but better safe than sorry.
              var salt = bcrypt.genSaltSync(10);
              var hashedPassword = bcrypt.hashSync(userdata.new1, salt);
              data.password = hashedPassword;
              res.send("success");
              data.save();

            }
          });
        }
      });
    }
    else{
      res.send("Not Same Account");
    }
  });
  //***Account Management***


  //***Account Activation***
  app.get('/graph/activateAccount/:code', function (req, res){

       User.findOne({username: req.cookies.username.toLowerCase(), account_activation_hash: req.params.code},
      function(err, result){    
        if(!err && result){
          result.account_activation_hash = "activated";
          result.save();
        }   
        res.redirect('/');
      });

  });
  //***Account Activation***


  //***Password Recovery***
  app.post('/graph/recoverPassword', function (req, res){

      console.log(basic.escapeRegExp(req.body.email));

      User.findOne({email: basic.escapeRegExp(req.body.email)},
      function(err, result){    
        if(!err && result){
          var pass_hash = uuid.v4();
          result.password_reset_hash = pass_hash;
          result.save();

          var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: 'saserb@gmail.com',
                  pass: 'Steve1997'
              }
          });

          // setup email data with unicode symbols
          var mailOptions = {
              from: '"Team Taiga" <saserb@gmail.com>', // sender address
              to: req.body.email, // list of receivers
              subject: 'Recover Password', // Subject line
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/resetPassword/' + pass_hash + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };

          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.log(error);
                  res.send("An error occured while sending the email.");
              }
              else{
                res.send("Email sent.");
              }
          });

        }   
      });
  });


  app.get('/resetPassword/:code', function (req, res){
    res.sendFile(__dirname + "/reset_password.html");
  });


  app.post('/resetPassword/:code', function (req, res){

      var userdata = req.body;

      User.findOne({password_reset_hash: req.params.code},
      function(err, result){    
        if(!err && result){
          
            if(userdata.password&&userdata.passwordVerif){
              if(userdata.password == userdata.passwordVerif){
                passwordVerifyString = basic.passwordRegex(userdata.password);

                if(passwordVerifyString != "ok"){
                  res.send(passwordVerifyString);
                }
                else {
                  userdata.password = userdata.password.trim().replace(/\\(.)/mg); //Impossible to have "\" but better safe than sorry.
                  var salt = bcrypt.genSaltSync(10);
                  var hashedPassword = bcrypt.hashSync(userdata.password, salt);
                  result.password = hashedPassword;
                  result.save();
                  res.send('Password changed');
                }
              }
            }
        }   
      });
  });
  //***Password Recovery***

};

