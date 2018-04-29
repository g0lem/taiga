var mongoose = require('mongoose');


//**Rooms**
var roomsSchema = new mongoose.Schema({
  roomname: {
    type: String,
    required: true
  },
  prettyname: {
    type: String,
    required: true
  },
  usersOnline: [ {} ], 
  messages: [
    {
      username: {
        type: String,
        required: true
      },
      timestamp: {
        type: Number
      },
      body: String,
      message_type: String
    }
  ]
},{collection:"rooms"});

mongoose.model('Room', roomsSchema);
//**Rooms**