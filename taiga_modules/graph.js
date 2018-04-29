var basic = require("./basic_functions");


module.exports = function(app, auth, mongoose, io){

  var Room = mongoose.model('Room');
  var User = mongoose.model('User');

  //***MongoDB REST API based Graph Routing***
  app.get('/graph/userlist', auth.isAuth, function(req,res, next){

    User.find(function(err,data){
      if(err){
        console.log(err);
      }
      res.send(data);
    });

  });


  app.get('/graph/friendlist', auth.isAuth, function(req,res, next){

    User.findOne({username: req.cookies.username.toLowerCase()},function(err,data){
      if(err || !data){
        console.log(err);
        res.send();
      }
      else{
        res.send(data.friends);
      }
    });

  });


  app.get('/graph/friend_requests', auth.isAuth, function(req,res, next){

    User.findOne({username: req.cookies.username.toLowerCase()},function(err,data){
      if(err || !data){
        console.log(err);
        res.send();
      }
      else{
        res.send(data.friend_requests);
      }
    });

  });


  app.get('/graph/roomlist', auth.isAuth, function(req,res, next){

    var all_data = {
      roomlist: {},
      eventlist: {}
    }
    var cookie_data = auth.getTokenData(req);
    Room.find({type:String},{messages:0},function(err,data){
      if(err){
        console.log(err);
      }
      all_data.roomlist = data;
      res.send(all_data);
    });

  });





  app.get('/graph/users/:username', auth.isAuth, function(req,res, next){

    User.find({ username: req.params.username.toLowerCase() },function(err,data){
      if(err){
        console.log(err);
      }

      if(data.length==0){
        res.send(null);
      }
      else {
        res.send({ id: data[0].id, username: data[0].username, screenname: data[0].screenname });
      }
    });

  });



  app.get('/graph/rooms/:type/:roomname/', auth.isAuth, function(req, res, next){

    var _Schema = Room; //We might change it when we add events
    //the :type request parameter is still here because we are going to add events 
    //or private rooms in the future, and it has to be added anyway at that point, the routes
    //work this way, so I won't mess with them right now

    _Schema.find({ roomname: req.params.roomname.toLowerCase() },function(err,data){

      if(err){
        console.log(err);
      }

      if(data.length==0){
        res.send(null);
      }
      else {
        res.send({ id: data[0].id, roomname: data[0].roomname, prettyname: data[0].prettyname, usersOnline: data[0].usersOnline });
      }
    });
  });



  app.get('/graph/messages/:type/:roomname', auth.isAuth, function(req,res){

    var _Schema = Room; //We might change it when we add events
    //the :type request parameter is still here because we are going to add events 
    //or private rooms in the future, and it has to be added anyway at that point, the routes
    //work this way, so I won't mess with them right now

    _Schema.find({ roomname: req.params.roomname.toLowerCase() }, function(err,data){
      if(err){
        console.log(err);
      }

      if(data.length==0){
        res.send(null);
      }
      else {
        var messages = data[0].messages;
        res.send(messages);
      }
    });
  });



  app.get('/graph/messages/:type/:roomname/:number', auth.isAuth, function(req,res){

    var _Schema = Room; //We might change it when we add events
    //the :type request parameter is still here because we are going to add events 
    //or private rooms in the future, and it has to be added anyway at that point, the routes
    //work this way, so I won't mess with them right now

    _Schema.find({ roomname: req.params.roomname.toLowerCase() }, function(err,data){

      if(err){
        console.log(err);
      }

      if(data.length==0){
        res.send(null);
      }
      else {
        //console.log(data[0].messages);

        if(data[0].messages.length - 20*(req.params.number-1) >= 0)
          if(data[0].messages.length - 20*(req.params.number) >= 0)
            var messages = data[0].messages.slice(data[0].messages.length - 20*req.params.number, data[0].messages.length - 20*(req.params.number-1));
          else
            var messages = data[0].messages.slice(0, data[0].messages.length - 20*(req.params.number-1));
        else
          var messages = [];
                        
        res.send(messages);
      }
    });
  });

  app.get('/graph/userlist/:type/:roomname', auth.isAuth, function(req,res){


    var _Schema = Room; //We might change it when we add events

    //the :type request parameter is still here because we are going to add events 
    //or private rooms in the future, and it has to be added anyway at that point, the routes
    //work this way, so I won't mess with them right now

    _Schema.find({ roomname: req.params.roomname.toLowerCase() }, function(err,data){

      if(err){
        console.log(err);
      }

      if(data.length==0){
        res.send(null);
      }
      else {
        var messages = data[0].usersOnline;
        res.send(messages);
      }
    });
  });


  app.post('/sendFriendRequest/:friendname', auth.isAuth, function (req, res){
    //TODO: add two parameters - username and friendname. Username is sent as parameter

    var userdata=req.body;
    var cookie_data = auth.getTokenData(req);
    var escapedUsername = basic.escapeRegExp(req.cookies.username);

    if(req.params.friendname.toLowerCase() != req.cookies.username.toLowerCase()){

      console.log(req.cookies.username);
      console.log(req.params.friendname);

    
        User.where({ username: req.params.friendname.toLowerCase() }).update({ $addToSet : {friend_requests:  req.cookies.username.toLowerCase() }},
          function(err, result){
            if(!err){
               User.where({ username: req.cookies.username.toLowerCase() }).update({ $addToSet : {sent_requests:  req.params.friendname.toLowerCase() }},
                  function(err, result){
                    if(!err){
                    res.send("success");
                    }
                    else{
                      res.send("err");
                    }
              });
            }
            else{
              res.send("err");
            }
       });
  
        


    }
    else{
      res.send("You can't be your own friend");
    }
  });

  app.post('/acceptFriendRequest/:friendname', auth.isAuth, function (req, res){
    //TODO: add two parameters - username and friendname. Username is sent as parameter

    var userdata=req.body;
    var cookie_data = auth.getTokenData(req);
    var escapedUsername = basic.escapeRegExp(cookie_data.username);



    User.where({ username: req.params.friendname.toLowerCase() })
      .update({ $addToSet : { friends:   req.cookies.username.toLowerCase() }, $pull : { sent_requests:   req.cookies.username.toLowerCase() } },
        function(err, result){
          if(!err && result){
              User.where({ username: req.cookies.username.toLowerCase() })
                .update({ $addToSet : { friends:  req.params.friendname.toLowerCase() }, $pull : { friend_requests:  req.params.friendname.toLowerCase() } },
                  function(err, result){
                    if(!err && result){
                    res.send("success");
                    }
                    else{
                      res.send("err");
                    }
              });
            }
            else{
              res.send("err");
            }
      });

  });

  app.post('/rejectFriendRequest/:friendname', auth.isAuth, function (req, res){
    //TODO: add two parameters - username and friendname. Username is sent as parameter



   User.where({ username: req.params.friendname.toLowerCase() })
        .update({ $pull : { sent_requests:   req.cookies.username.toLowerCase() } },
          function(err, result){
            if(!err && result){
                User.where({ username: req.cookies.username.toLowerCase() })
                  .update({ $pull : { friend_requests:  req.params.friendname.toLowerCase() } },
                    function(err, result){
                      if(!err && result){
                      res.send("success");
                      }
                      else{
                        res.send("err");
                      }
                });
              }
              else{
                res.send("err");
              }
        });
  });

  app.post('/removeFriend/:friendname', auth.isAuth, function (req, res){
    //TODO: add two parameters - username and friendname. Username is sent as parameter


    User.where({ username: req.params.friendname.toLowerCase() })
      .update({ $pull : { friends:   req.cookies.username.toLowerCase() } },
        function(err, result){
          if(!err && result){
              User.where({ username: req.cookies.username.toLowerCase() })
                .update({ $pull : { friends:  req.params.friendname.toLowerCase() } },
                  function(err, result){
                    if(!err && result){
                    res.send("success");
                    }
                    else{
                      res.send("err");
                    }
              });
            }
            else{
              res.send("err");
            }
      });

  });




  app.post('/graph/sendMessage/', auth.isAuth, function (req, res){
      // var sentMessage=req.body;
      // var finalMessage = { userid: mongoose.Types.ObjectId(req.body.userid), body: req.body.body, timestamp: Date(req.body.timestamp) };
      var _Schema = Room; //We might change it when we add events
      //the :type request parameter is still here because we are going to add events 
      //or private rooms in the future, and it has to be added anyway at that point, the routes
      //work this way, so I won't mess with them right now
      var cookie_data = auth.getTokenData(req);

      if(req.body.message_type === "text"){ // pune-l si sa nu expire

          var message_to_push = { username: cookie_data.username, body: req.body.body, timestamp: new Date().getTime(),  message_type: req.body.message_type};
          _Schema.where({ roomname: req.body.roomname.toLowerCase() }).update({ $push : {messages:  message_to_push}},
          function(err, result){    
            if(err)
              res.send(err);  
            else{
              io.to(req.body.roomname.toLowerCase()).emit('message recieved', message_to_push);
              res.send("success");       
            }
          });
      }
      else {
          res.send("/");
      }  
  });


  app.post('/graph/setUserColor/:color', auth.isAuth, function (req, res){

    
      User.findOne({username: req.cookies.username.toLowerCase()},
      function(err, result){    
          if(err)
            res.send(err);  
          else if(result){
            result.user_color = "#" + req.params.color;
            result.save();
            res.send("success");       
          }
          else
            res.send('failed');
      });
      
  });



  app.get('/graph/getUserColor/:username', auth.isAuth, function (req, res){

      User.findOne({username: req.params.username.toLowerCase()},
      function(err, result){    
          if(err)
            res.send("#000000");  
          else if(result){
            res.send(result.user_color);       
          }
          else
            res.send("#000000");  
      });
      
  });

  // app.get('/graph/testMail', function (req, res){

  //   // create reusable transporter object using the default SMTP transport
  //   var transporter = nodemailer.createTransport({
  //       service: 'gmail',
  //       auth: {
  //           user: 'saserb@gmail.com',
  //           pass: 'steve1997'
  //       }
  //   });

  //   // setup email data with unicode symbols
  //   var mailOptions = {
  //       from: '"Fred Foo 👻" <saserb@gmail.com>', // sender address
  //       to: 'saserb@gmail.com', // list of receivers
  //       subject: 'Hello ✔', // Subject line
  //       text: 'Hello world ?', // plain text body
  //       html: '<b>Hello world ?</b>' // html body
  //   };

  //   // send mail with defined transport object
  //   transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //           return console.log(error);
  //       }
  //       console.log('Message %s sent: %s', info.messageId, info.response);
  //   });

  // });






  // app.post('*/graph/joinEvent', auth.isAuth, function (req, res){

             
  //     var cookie_data = auth.getTokenData(req);


  //     Event.where({ join_code: req.body.id })
  //         .update({ $addToSet : {participants: cookie_data.username }}, //$addToSet ensures that we only push a user ONCE, otherwise if you had more tabs opened the user would show multiple times
  //                 function(err, result){
         
  //                 });        
      
     
  // });
  //+++ DON'T ABIDE DESIGN RULES. TO FIX +++
    //***MongoDB REST API based Graph Routing***
};

