var mongoose = require('mongoose');

//**Users**
var usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  screenname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  account_activation_hash:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  password_reset_hash:{
    type: String
  },
  sesstoken: {
    type: String,
    default: ""
  },
  sessip: {
    type: String,
    default: ""
  },
  friend_requests: [],
  friends: [],
  sent_requests: [],
  rooms_joined: [],
  last_logged_in: String, 
  user_color:  {
    type: String,
    default: "#000000"
  }

},{collection:"users"});

mongoose.model('User', usersSchema);
//**Users**