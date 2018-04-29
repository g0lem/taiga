//**i declared logOut here, because I am going to use it outside the jqueryUI**
var logOut;

var jqueryUI = (function(){
$(".chatwrapper").css( "height", ($( window ).height()-100));
$( window ).resize(function(){
    $(".backgroundchat").css( "height", "100%");
    $(".chatwrapper").css( "height", ($( window ).height()-100));
});
if($(".username").width()>245){
  $(".username").css( "font-size", 13);        
}
else if($(".username").width()>196){
  $(".username").css( "font-size", 16);        
}
else if($(".username").width()>158){
  $(".username").css( "font-size", 20);
}
var roomlistClosed=true;
var userlistClosed=true;
var lowScreenSize=false;
var mobileScreenSize=false;
var emojiboxopen=0;
var setBlocksWidth = function (){
  if(roomlistClosed&&userlistClosed){ 
    $(".chatwindow").removeClass("lowScreenChat");  
    $(".chatwindow").removeClass("midScreenChat"); 
    $(".chatwindow").removeClass("highScreenChat"); 
    $(".chatwindow").addClass("fullScreenChat");
    //both Closed
  }
  else if(roomlistClosed){ 
    $(".chatwindow").removeClass("lowScreenChat"); 
    $(".chatwindow").removeClass("fullScreenChat");  
    $(".chatwindow").removeClass("midScreenChat");  
    $(".chatwindow").addClass("highScreenChat"); 
    //roomlist Closed
  }
  else if(userlistClosed){ 
    $(".chatwindow").removeClass("lowScreenChat");
    $(".chatwindow").removeClass("fullScreenChat");
    $(".chatwindow").removeClass("highScreenChat");
    $(".chatwindow").addClass("midScreenChat");
    //userlist Closed
  }
  else{
    $(".chatwindow").removeClass("fullScreenChat"); 
    $(".chatwindow").removeClass("midScreenChat");
    $(".chatwindow").removeClass("highScreenChat");
    $(".chatwindow").addClass("lowScreenChat");
    //none Closed
  }
}
//720 width -> need to make background chat
if($( window ).width()<700){
  mobileScreenSize=true;
  if(!userlistClosed||!roomlistClosed){
    $(".chat").addClass("opacityZero");
  }
}
$( window ).resize(function(){
  if($( window ).width()<700){
    mobileScreenSize=true;
    if(!userlistClosed||!roomlistClosed){
      $(".chat").addClass("opacityZero");
    }
  }
  else{
    mobileScreenSize=false;
    $(".chat").removeClass("opacityZero");
  }
});
if($( window ).width()<1000){
  lowScreenSize = true;
  if(!userlistClosed&&!roomlistClosed){
    userlistClosed=!userlistClosed;
    $(".userlist").toggleClass("pullRightVanish");
    setBlocksWidth();      
  }
}
$( window ).resize(function(){
  if($( window ).width()<1000){
    lowScreenSize = true;
    if(!userlistClosed&&!roomlistClosed){
      userlistClosed=!userlistClosed;
      $(".userlist").toggleClass("pullRightVanish");
      $(".usercontainer").toggleClass("displayNone");
      setBlocksWidth();      
    }
  }
  else{
    lowScreenSize = false;
  }
});
setBlocksWidth();
$( ".roomlistbtn" ).click(function() {
  roomlistClosed=!roomlistClosed;
  $(".roomlist").toggleClass("pullLeftVanish");
  $(".rooms").toggleClass("opacityZero");
  $(".userinfo").toggleClass("opacityZero");
  if(lowScreenSize&&!userlistClosed&&!roomlistClosed){
    userlistClosed=!userlistClosed;
    $(".userlist").toggleClass("pullRightVanish");
    $(".usercontainer").toggleClass("displayNone");
  }
  if(mobileScreenSize&&(!userlistClosed||!roomlistClosed)){
    $(".chat").addClass("opacityZero");
  }
  else{
    $(".chat").removeClass("opacityZero"); 
  }
  setBlocksWidth();
});
$( ".userlistbtn" ).click(function() {
  userlistClosed=!userlistClosed;
  $(".userlist").toggleClass("pullRightVanish");
  $(".usercontainer").toggleClass("displayNone");
  if(lowScreenSize&&!roomlistClosed&&!userlistClosed){
    roomlistClosed=!roomlistClosed;
    $(".roomlist").toggleClass("pullLeftVanish");
    $(".rooms").toggleClass("opacityZero");
    $(".userinfo").toggleClass("opacityZero");
  }
  if(mobileScreenSize&&(!userlistClosed||!roomlistClosed)){
    $(".chat").addClass("opacityZero");
  }
  else{
    $(".chat").removeClass("opacityZero"); 
  }
  setBlocksWidth();
});
$( ".room" ).click(function() {
  //ROOM CLICK HANDLER
  if(mobileScreenSize){
    $(".roomlistbtn").click();
  }
});
$( ".userprofilebtn" ).click(function() {
  $(".profilecontainer").addClass("displayNone");
  $(".userprofilepanel").removeClass("displayNone");
});
$( ".usersettingsbtn" ).click(function() {
  $(".profilecontainer").addClass("displayNone");
  $(".usersettingspanel").removeClass("displayNone");
});

$( ".changeprofilepic" ).click(function() {
  $(".usersettingspanel").addClass("displayNone");
  $(".imageoverlay").removeClass("displayNone");
  $(".bgimageoverlay").addClass("displayNone");
  $(".overlay").removeClass("displayNone");
});

$( ".changephoto" ).click(function() {
  $(".usersettingspanel").addClass("displayNone");
  $(".imageoverlay").removeClass("displayNone");
  $(".bgimageoverlay").addClass("displayNone");
  $(".overlay").removeClass("displayNone");
});

$( ".changesettingsbackground" ).click(function() {
  $(".bgimageoverlay").removeClass("displayNone");
  $(".overlay").removeClass("displayNone");
  $(".imageoverlay").addClass("displayNone");
});

$( ".backbtn" ).click(function() {
  $(".usersettingspanel").addClass("displayNone");
  $(".userprofilepanel").addClass("displayNone");
  $(".profilecontainer").removeClass("displayNone");
});
$( ".sendemoji" ).click(function() {
  if(emojiboxopen==0){
    $(".emojibox").removeClass("displayNone");
    $(".emojiboxopen").removeClass("displayNone");
    $(".emojiboxclosed").addClass("displayNone");
    emojiboxopen=!emojiboxopen;
  }
  else if(emojiboxopen){
    $(".emojibox").addClass("displayNone");
    $(".emojiboxopen").addClass("displayNone");
    $(".emojiboxclosed").removeClass("displayNone"); 
    emojiboxopen=!emojiboxopen;
  }
});



$(function(){
  $(".roomlistbtn").click();
  document.addEventListener('keydown', function (event){
    var keyPressed=[];
    if(event){
        keyPressed[event.keyCode] = true;
        if(keyPressed[13] && !event.shiftKey){
          event.preventDefault();
          $(".sendmsg").click();
          //TODO: add handler that removes the newline after enter is pressed
        }
    }
  });
});

//if you click outside the overlay you close the overlay

$(document).mousedown(function (e)
{
    var container = $(".imageoverlay");
    var container2 = $(".bgimageoverlay");


    if (!container.is(e.target) && !container2.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0 && container2.has(e.target).length === 0)  // ... nor a descendant of the container
    {
        $(".overlay").addClass("displayNone");
    }
});

// var $head = $("iframe").contents().find("body"); 
// $head.append(' <script src="https://code.jquery.com/jquery-1.10.2.js"></script> <script>$("video").removeAttr("autoplay")</script>' );
// var iframe = document.getElementById('iframe');
// iframe = iframe.contentWindow || ( iframe.contentDocument.document || iframe.contentDocument);

// iframe.document.open();
// iframe.document.write('Hello World!');
// iframe.document.close();



//**cookie related stuff ahead**
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

var cookieRegistry = [];

function listenCookieChange(cookieName, callback) {
    setInterval(function() {
        if (cookieRegistry[cookieName]) {
            if (readCookie(cookieName) != cookieRegistry[cookieName]) { 
                // update registry so we dont get triggered again
                cookieRegistry[cookieName] = readCookie(cookieName); 
                return callback();
            } 
        } else {
            cookieRegistry[cookieName] = readCookie(cookieName);
        }
    }, 100);
}


function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}


//**this is to log out everyone who messes with the cookies**
var cookielist = ['username', 'sesid', 'io'];


//**logOut is declared outside jqueryUI, in order to be used with angular**
logOut = function(){
    for(var i in cookielist){
    eraseCookie(cookielist[i]);
    }
    window.location.href="";
}

$('.chatview').scrollTop($('.chatview')[0].scrollHeight);

cookielist.forEach(function(element){

  listenCookieChange(element, function() {

    logOut();
  });

});

});

