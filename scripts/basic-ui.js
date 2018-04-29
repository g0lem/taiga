$("#sign_up").on('click', function(){
        var preparedJSON = {
          username : $("#username").val() ,
          password : $("#pass1").val() ,
          email : $("#email").val() ,
          passwordVerif : $("#pass2").val()
        }
        //***register account***
        $.post( "/creating", preparedJSON, function( res ) {

              $("#status").html(res);
                  if(res=="Account created!"){
                      setTimeout(function(){
                      window.location.href = ("/");
                            //$window.url('/');
                       }, 500);
                  }   
        });
});


$("#login").on('click', function(){

var preparedJSON = {
        username : $("#username").val() ,
        password : $("#pass").val() ,
      }
      //***login account***
      $.post( "/loggingIn", preparedJSON, function( res ) {

          $("#status").html(res);
          if(res=="Logged in."){ 
              setTimeout(function(){       
              window.location.href = ("/");
            }, 500);
          }
      });  
});

$("#reset_password").on('click', function(){
      var preparedJSON = {
        password: $("#pass1").val(),
        passwordVerif : $("#pass2").val()
      }
      //***login account***
      $.post( window.location.href , preparedJSON, function( res ) {

          $("#status").html(res);
          if(res=="Password changed"){ 
              setTimeout(function(){       
              window.location.href = ("/");
            }, 500);
          }
      });
});


$("#reset").on('click', function(){
      var preparedJSON = {
        email : $("#email").val()
      }
      //***login account***
      $.post( "/graph/recoverPassword", preparedJSON, function( res ) {

          $("#status").html(res);
          if(res=="Email sent."){ 
              setTimeout(function(){       
              window.location.href = ("/");
            }, 500);
          }
      });
});


$(function(){
     $('.form').find('input').on('keyup', function(e){
       if(e.keyCode === 13) {
          $( ".send" ).trigger( "click" );
        };
     });
});
