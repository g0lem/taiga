

module.exports = function(mongoose, io){

	var User = mongoose.model('User');
	var Room = mongoose.model('Room');

	//***Sockets***
	io.on('connection', function(socket){

	  //Confirm Connection

	  //Ok, the following is pretty cluster fucky
	  socket.on('join room', function(param){
	    //Leave the last room you've been on so that you won't recieve messages from it
	    socket.leave(param.lastroom);
	    //***join the new room***
	    socket.join(param.roomname);
	    socket.broadcast.emit('user joined', param);

	    //Let the database know the user is online right now
	    User.findOne( {username: param.username.toLowerCase() }, function(err, result){
	      if(!err){
	        result.last_logged_in = "now";
	        result.save();
	      }
	    });

	    //The User query below is only going to be useful when we are going to make room tabs, 
	    //Right now it's not doing anything
	     //$addToSet ensures that we only push a user ONCE, otherwise if you had more tabs opened the user would show multiple times
	    
	    User.where({ username: param.username.toLowerCase() })
	    .update({ $addToSet : {rooms_joined: param.roomname.toLowerCase() }},
	       function(err, result){
	      }
	    );

	    //Delete the user from the userlist after he left the room
	    Room.where({ usersOnline: param.username })
	    .update({ $pull : {usersOnline: param.username}},
	    //$addToSet ensures that we only push a user ONCE, otherwise if you had more tabs opened the user would show multiple times
	      function(err, result){
	      }
	    );

	    //Push user to a room's userlist after he joins a room
	    Room.find({ usersOnline: param.username }, function(err, result){
	      Room.where({ roomname: param.roomname.toLowerCase() })
	      .update({ $addToSet : {usersOnline: param.username}},
	        //$addToSet ensures that we only push a user ONCE, otherwise if you had more tabs opened the user would show multiple times
	        function(err, result){
	          var tmp = {
	              lastroom: param.roomname,
	              username: param.username
	          }
	          //***join an empty room, this is what I get from not making an 'user joined' and an 'user left'
	          socket.emit('user joined', tmp);
	        }
	      );
	    });

	    socket.on('disconnect', function(){
	      socket.leave(param.roomname.toLowerCase());
	      //Remove user from userlist after disconnect
	      Room.where({ roomname: param.roomname.toLowerCase() })
	      .update({ $pull : {usersOnline: param.username}},
	        function(err, result){
	        }
	      );
	      User.where({ username: param.username.toLowerCase() })
	      .update({ $pull : {rooms_joined: param.roomname.toLowerCase() }},
	      //$addToSet ensures that we only push a user ONCE, otherwise if you had more tabs opened the user would show multiple times
	        function(err, result){
	          User.findOne( {username: param.username }, function(err, usr){
	          });
	        }
	      );
	    });
	  });
	//***Sockets***
});



}