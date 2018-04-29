//***Regular Expressions***


module.exports.usernameRegex = function(username){
  if(username.length < 4){//put <4, but I wanna test
    return("Username is too short!");
  }
  else if(username.length > 12){
    return("Username is too long!");
  }
  else if(username.search(/[^a-zA-Z0-9\_\.]/) != -1){
    return("In your username you can only use letters, numbers and the next set of symbols:\"., _\". ");
  }
  return("ok");
}

module.exports.emailRegex = function(username){
  // if(username.length < 4){//put <4, but I wanna test
  //   return("Username is too short!");
  // }
  // else if(username.length > 12){
  //   return("Username is too long!");
  // }
  // else if(username.search(/[^a-zA-Z0-9\_\.]/) != -1){
  //   return("In your username you can only use letters, numbers and the next set of symbols:\"., _\". ");
  // }
  return("ok");
}


module.exports.passwordRegex = function(password){
  if(password.length < 6){//put <6, but I wanna test
    return("Password is too short!");
  }
  else if(password.length > 50){
    return("Password is too long!");
  }
  else if(password.search(/[^a-zA-Z0-9\!\@\#\$\*\_\+\.]/) != -1){
    return("In your password you can only use letters, numbers and the next set of symbols:\"!, @, #, $, *, ., +, _\". ");
  }
  return("ok");
}
//***Regular Expressions***



//***Basic Functions***
var escapeRegExp;
(function (){
  // Referring to the table here:
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
  // these characters should be escaped
  // \ ^ $ * + ? . ( ) | { } [ ]
  // These characters only have special meaning inside of brackets
  // they do not need to be escaped, but they MAY be escaped
  // without any adverse effects (to the best of my knowledge and casual testing)
  // : ! , = 
  // my test "~!@#$%^&*(){}[]`/=?+\|-_;:'\",<.>".match(/[\#]/g)

  var specials = [
    // order matters for these
      "-"
    , "["
    , "]"
    // order doesn't matter for any of these
    , "/"
    , "{"
    , "}"
    , "("
    , ")"
    , "*"
    , "+"
    , "?"
    , "."
    , "\\"
    , "^"
    , "$"
    , "|"
    , "="
  ]
  // I choose to escape every character with '\'
  // even though only some strictly require it when inside of []
  , regex = RegExp('[' + specials.join('\\') + ']', 'g')
  ;

  module.exports.escapeRegExp = function (str){

  return str.replace(regex, "\\$&");
  };
}());



//***Basic Functions***

