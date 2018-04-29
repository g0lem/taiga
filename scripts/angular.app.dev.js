//*******************************************************
//***************** angular.app.js **********************
//*******************************************************
//*                                                     *
//* this file contains the definition and configuration *
//*           of our angular application                *
//*                                                     *
//*******************************************************


var socket = io.connect();  //  it's easier to use it as global, it's totally useless to do it local
                            //  if someone wants to declare it, they can do so at any time from the 
                            //  console, so this doesn't make the application any more (or less) 
                            //  secure than it already is (the backend has to deal with this issue)

(function(){

  'use strict';

  //*************************************
  //* here we define our app in angular *
  //*************************************

  angular.module('TaigaApp', ['angularFileUpload', 'ngImgCrop', 'ui.router', 'ngSanitize']); //'ngRoute',


  //*************************************************
  //************* AngularJS routing *****************
  //*************************************************
  //* here we define our app's routes and templates *
  //*************************************************

  angular
      .module('TaigaApp')
      .config([ '$stateProvider'
              , '$urlRouterProvider'
              , routeConfig
              ]);


  //*************************************************
  //*            the routing function               *
  //*************************************************

  function routeConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        views:{
            'room_select':{
                  templateUrl: './partials/chat/roomselect.html',
                  controller: 'RoomSelectController'
            },
            'chat_room':{
                templateUrl: './partials/chat/chatroom.html',
                controller: 'ChatWindowController'
            },
            'user_list':{
                templateUrl: './partials/user/userlist.html',
                controller: 'UserListController'
            },
            'friend_list':{
                templateUrl: './partials/user/friendlist.html',
                controller: 'UserListController'
            },
            'options':{
                templateUrl: './partials/user/me.html',
                controller: 'RoomSelectController'
            }
        }
      });
      $urlRouterProvider.otherwise('/');
      
  }


  //***************************************************
  //* useful function for all strings it replaces all *
  //*         instances of a certain string           *
  //***************************************************

  String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
  };


  //************************************************
  //* useful function for all strings it tells you *
  //*    if a string is empty (unsurprisingly)     *
  //************************************************

  String.prototype.isEmpty = function(){  
    if(!this.match(/\S/)){
      return 1;
    }
    else{
      return 0;
    }
  }

})();
//*******************************************************
//****************** emoji.factory.js *******************
//*******************************************************
//*                                                     *
//*  this source handles all emoji basic functionality  *
//*                                                     *
//*******************************************************


(function(){

  'use strict';

  angular
      .module('TaigaApp')
      .factory('emoji', [ '$http'
                        , '$q'
                        , '$stateParams'
                        , emojiFactory
                        ]);


      function emojiFactory($http, $q, $stateParams) {

        var emoji_factory = {

          //*******************************************
          //* factory variables in alphabetical order *
          //*******************************************

          emojis:               [],
          emoji_filter:        "people",
          show_emoji_picker:    0,

          //*******************************************
          //* factory functions in alphabetical order *
          //*******************************************

          emoji:                emoji,
          emojipicker_switch:   emojipicker_switch,
          changeEmojiFilter:    changeEmojiFilter,
          loadEmoji:            loadEmoji,
          showEmoji:            showEmoji

        };

        return emoji_factory;


        function emojipicker_switch(){

            emoji_factory.show_emoji_picker = !emoji_factory.show_emoji_picker;

            if( emoji_factory.show_emoji_picker ){
              emoji_factory.loadEmoji();
            }

        }

        function changeEmojiFilter(str){
                                                                              //+-------------------------------------------+
            if(!emoji_factory.emojis[0]){                                     //|     check if emojies already loaded,      | 
              emoji_factory.loadEmoji();                                      //| maybe I can find a less shit way to do it |                                       
            }                                                                 //+-------------------------------------------+

            emoji_factory.show_emoji_picker = 1;
            emoji_factory.emoji_filter = str;

        }


        function showEmoji(emj){
            return emj.category === emoji_factory.emoji_filter &&  emoji_factory.show_emoji_picker;
        }


        function loadEmoji(){            
          for (var i in emoji_list){
            emoji_factory.emojis.push(emoji_list[i]);
          }
        }


        function emoji(){
          twemoji.parse(document, {folder: 'svg', ext:".svg"});
          twemoji.parse(document.body, {folder: 'svg', ext:".svg"});       
        }


  }

})();

//*******************************************************
//***************** fetcher.factory.js ******************
//*******************************************************
//*                                                     *
//*  this source deals with server requests for user or *
//* room details, it "fetches" things from the database *
//*                                                     *
//*******************************************************

(function(){

  'use strict';

  angular
      .module('TaigaApp')
      .factory('fetcher', [ '$http'
                          , '$location'
                          , '$q'
                          , fetcherFactory
                          ]);


  function fetcherFactory ( $http
                          , $location
                          , $q
                          ){

      var o = {

        //*******************************************
        //* factory variables in alphabetical order *
        //*******************************************

        lastroom:                  "",
        roomname:                  $location.search().room,
        type:                     "public",

        //*******************************************
        //* factory functions in alphabetical order *
        //*******************************************

        getFriendlist:            getFriendlist,
        getFriendRequestsData:    getFriendRequestsData,
        getLastRoom:              getLastRoom,
        getRoomData:              getRoomData,
        getRoomlist:              getRoomlist,
        getRoomname:              getRoomname,
        getUserlist:              getUserlist,
        getUsername:              getUsername,
        getMessages:              getMessages,
        increaseMessageNumber:    increaseMessageNumber,
        reloadData:               reloadData,
        reloadMessages:           reloadMessages,
        setLastRoom:              setLastRoom,
        updateAll:                updateAll

      };

      return o;


      //FETCH - ers
      //***getting the username***
      function getUsername(){
        return $http.get("/auth/getUsername") //HTTP GET CALL to mongodb REST API
        .then(function(res) {
          return res.data;
        });
      };

      function getRoomlist(){
        return $http.get("/graph/roomlist") //HTTP GET CALL to mongodb REST API
        .then(function(res) {
          var tmp = res.data.roomlist;
          return tmp;
        });    
      };

      function getFriendlist(){
        return $http.get("/graph/friendlist") //HTTP GET CALL to mongodb REST API
        .then(function(res) {
          var tmp = res.data;
          return tmp;
        });    
      };


      //***get all room data on a certain room***
      function getRoomData(){
        var roomname = $location.search().room;

        return $http.get("/graph/rooms/"+o.type+ "/" + $location.search().room) //HTTP GET CALL to mongodb REST API
        .then(function(res){
           return res.data;     
        });  
      }

      //***get the roomname***
      function getRoomname(){
        return $location.search().room;        
      }

      //***get all the users on a certain room***
      function getUserlist(){
        var roomname = o.roomname;

        return $http.get("/graph/userlist/"+o.type+ "/" +roomname) //HTTP GET CALL to mongodb REST API
        .then(function(res) {
            return res.data;       
        });
      }

      //***get all friend requests***
      function getFriendRequestsData(){
          var q = $q.defer();

          var roomname = o.roomname;

          $http.get("/graph/friend_requests/") //HTTP GET CALL to mongodb REST API
          .then(function(res) {
            if(res){
              q.resolve(res.data);
            }
            else{
              q.reject('No room');
            }
          }, function(err){
            q.reject(err);
          });
          return q.promise;
      } 

      //***get the last 20 messages on the room***
      function getMessages(roomname){
        var q = $q.defer();
    
        $http.get("/graph/messages/"+ o.type + "/" +roomname+"/"+o.message_multiplier) //HTTP GET CALL to pseudo-rest function made in express for list of messages
        .then(function(res) {
          if(res){
            q.resolve(res.data);
          }
          else{
            q.reject('No messages')
          }
        }, function(err){
          q.reject(err);
        });
        return q.promise;
      }
     
      function getRoomname(){
        if($location.search().room!=undefined)
          return $location.search().room;
        else
          return "";
      }
    
      function increaseMessageNumber(){
        o.message_multiplier++;
    
        return $http.get("/graph/messages/"+ o.type + "/" +o.roomname+"/"+o.message_multiplier) //HTTP GET CALL to pseudo-rest function made in express for list of messages
        .then(function(res) {
            o.messages = res.data.concat(o.messages);
            //o.message = res.data;
            //o.messages.unshift(res.data);
            console.log(res.data);
            return o.messages;
        });     
      }


      function reloadMessages(){   
        o.roomname = $location.search().room;
        var roomname = o.roomname;
        o.messages = [];  
        o.message_multiplier = 1;

        $http.get("/graph/messages/"+ o.type + "/" +roomname+"/"+o.message_multiplier) //HTTP GET CALL to pseudo-rest function made in express for list of messages
        .then(function(res){   
          o.messages = res.data;  
        });
      }
       
      reloadMessages();
      

      function setLastRoom(room){
         o.lastroom = room;
      }

      function getLastRoom(){
        return o.lastroom;
      }

      function updateAll(){
        o.reloadMessages();
      }

      function reloadData(scope){
        o.getUsername()
        .then(function(response){ 
          scope.username = response; 
          scope.profilePictureAddress = 'image/profile/profile-'+scope.username;
          o.getRoomlist().then(function(response){ scope.roomlist = response; });
          if($location.search().room === undefined){      
            socket.emit('join room', { roomname: "", username: scope.username});
          }
          else{
            $('.chat').removeClass('displayNone');
            reloadMessages();
            socket.emit('join room', { roomname: $location.search().room, username: scope.username});
          }
          events.emit('reset room', {});  
          events.emit('change room', {});    
          //**I have to reload some stuff into the user-panel.js**
        });
      }

      

  }

})();
//*******************************************************
//***************** fetcher.factory.js ******************
//*******************************************************
//*                                                     *
//*  this source deals with server requests for  room   *
//*   details, like the fetcher, but it has message     *
//*               related functions                     *
//*                                                     *
//*******************************************************

(function(){

    'use strict';

    angular
        .module('TaigaApp')
        .factory('room',  [ '$http'
                          , '$q'
                          , '$stateParams'
                          ,'fetcher'
                          , '$anchorScroll'
                          , roomFactory
                          ]);


    function roomFactory( $http
                        , $q 
                        , $stateParams
                        , fetcher
                        , $anchorScroll
                        ){


        //*******************************************
        //* factory variables in alphabetical order *
        //*******************************************

        var o               =      fetcher;
        o.messages          =      [];
        fetcher.getRoomData().then(function(response){ o.room = response; });

        //*******************************************
        //* factory functions in alphabetical order *
        //*******************************************
        
        o.getRoom           =      getRoom;
        o.getRoomname       =      getRoomname;
        o.addMessage        =      addMessage;
        o.sendMessage       =      sendMessage;
      


        return o;


        function getRoomname(){
          return this.roomname;
        }
      
        function sendMessage(message){
          $http.post("/graph/sendMessage/" ,message);
          //o.messages.push(message);
        }
      
        function addMessage(message){ 
          o.messages.push(message);
          $http.post("/addMessage",message).then(function(res){ $anchorScroll("bottom_message"); });
        }
      
        function getRoom() { return o.room; }
    

    }



})();
//*******************************************************
//***************** upload.factory.js *******************
//*******************************************************
//*                                                     *
//*    this source deals with all the file upload in    *
//*   our application, this includes photos in the      *
//*  chatrooms, profile pictures and background photos  *
//*                                                     *
//*******************************************************





(function(){

  'use strict';

  angular
      .module('TaigaApp')
      .factory('upload_factory' , ['$http'
                                  ,'FileUploader'
                                  , 'FileItem'
                                  ,'$location'
                                  , uploadFactory
                                  ]);



  function uploadFactory( $http
                        , FileUploader
                        , FileItem
                        , $location
                        ){

    var upload = {

      basicFunctions:   basicFunctions,
      init:             init 

    };

    return upload;

    function init(type, scope){

      var uploader;
      switch(type){

        case "room":
          uploader = new FileUploader();
          uploader.url = "/upload/background/";
          uploader.removeAfterUpload  = 1;
          uploader.alias = "file";

          var handleFileSelect=function(evt) {
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
              scope.$apply(function(scope){
                scope.myImage=evt.target.result;
              });
            }; 
            reader.readAsDataURL(file); 
          }

          angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

        break;


        case "chat":
          uploader = new FileUploader();
          uploader.url = "/upload/image/public/"+$location.search().room;
          uploader.autoUpload = 1;
          uploader.removeAfterUpload  = 1;
          uploader.alias = "file";
          
          uploader.onSuccessItem = function(item, response, status, headers){
            scope.room_factory.sendMessage(response);
          };

      }

      return uploader;
    }


    function basicFunctions(scope){
      var func = {};

      func.handleCropUpload = function(){
        var preparedJSON = {
          endodedImage: scope.myCroppedImage
        };         
        $http.post("/upload/profile/",  preparedJSON ).then(function(res){
            scope.profilePictureAddress += "?";                 
        });
      }

      func.handleUpload = function(){   

        scope.uploader.getNotUploadedItems()[0].onSuccess = function(response, status, headers){
          $('.chat').css('background-image', "url('/image/background/?t="+Date.now()+"'");             
        };
        scope.uploader.uploadItem(0);
      }

      return func;
    }

  }


})();
//*******************************************************
//************** chatwindow.controller.js ***************
//*******************************************************
//*                                                     *
//* this source controls all the interactions between   *
//*               the user and the chat                 *
//*                                                     *
//*******************************************************

(function(){

  'use strict';

  //*******************************************************
  //* we include the dependencies of this controller here *
  //*******************************************************
  angular
      .module('TaigaApp')
      .controller('ChatWindowController', 
                 [ '$scope'
                 , '$stateParams'
                 , '$http'
                 , '$q'
                 , 'room'
                 , 'upload_factory'
                 , 'emoji'
                 , '$location'
                 , '$anchorScroll'
                 , chatWindowController //<-our controller function
                 ]);


  //TODO: make this controller a bit more modular
  //************************************************************
  //* here is our actual controller function, it has an awfull *
  //*  awfull lot of parameters, but this is where everything  *
  //*            in the chat actually happens                  *
  //************************************************************

  function chatWindowController($scope
                              , $stateParams
                              , $http
                              , $q
                              , room
                              , upload_factory
                              , emoji
                              , $location
                              , $anchorScroll
                              ){


    //*****************************************************
    //* initializing variables in alphabetical order here *
    //*****************************************************

    $scope.bottomscroll       =   -1;
    $scope.emoji              =   emoji; 
    $scope.messages           =   room.messages;
    $scope.newMessage         =   "";
    $scope.room_factory       =   room; 
    $scope.uploader           =   upload_factory.init("chat", $scope);
    $scope.user_color         =   "#2ecc71";

    //*****************************************************
    //* initializing functions in alphabetical order here *
    //*****************************************************

    $scope.addEmoji           =   addEmoji;
    $scope.init               =   init;
    $scope.getChatBubbleForm  =   getChatBubbleForm;
    $scope.getColor           =   getColor;
    $scope.getMoreMessages    =   getMoreMessages;
    $scope.gotoBottom         =   gotoBottom;
    $scope.playVideo          =   playVideo;
    $scope.sendMessage        =   sendMessage;
    $scope.showImage          =   showImage;
    $scope.showVideo          =   showVideo;

    //*****************************************************
    //* here are some functions that need to be executed  *
    //*        when this controller loads                 *
    //*                                                   *
    //*    this is not very stylish, maybe we can find a  *
    //*       better solution to this in the future       *
    //*****************************************************

    room.getUsername().then(function(response){ $scope.username = response; });
    $scope.gotoBottom();

    //*********************************************
    //* the definition of all the functions ahead *
    //*********************************************

    function playVideo(message){
        message.autoplay = "on";
    }

    function showImage(message){
       if(message.message_type === 'image')
        return "/image/chat/" + message.body;
       else
        return "";
    }

    function showVideo(message){
       if(message.message_type === 'video')
        return "/image/chat/" + message.body;
       else
        return "";
    }

    function getColor(username){
      return $http.get('/graph/getUserColor/'+username).then(function(res){
        return res.data;
      });
    }


    function getChatBubbleForm(sent,user){
      return (sent==user)?"usercb":"othercb"
    }


    function gotoBottom() {
      $('.chatview').scrollTop($('.chatview')[0].scrollHeight);
    };


    function init(){  
      $scope.emoji.emoji();
    }    

    function addEmoji(emj){
      $scope.newMessage += emj.char;
    }     
      

    function getTimestamp(){
      return Date.now();
    }
       
    function sendMessage(){
    
      if(!$scope.newMessage.isEmpty()){
    
        var message=$scope.newMessage;
    
        for (var i in emoji_list) {
             message = message.replaceAll(":"+i+":", emoji_list[i].char);
        }
    
        var preparedJSON={
          "room_type": "public",
          "username" : $scope.username,
          "roomname":$location.search().room,
          "body": message,
          "timestamp":getTimestamp(), 
          "message_type": "text"
        };

        $scope.room_factory.sendMessage(preparedJSON);
        $scope.newMessage="";
        //$scope.gotoBottom();

      }
    }

    function getMoreMessages(){

      room.increaseMessageNumber().then(function(response){
        $scope.messages = $scope.room_factory.messages;
        $anchorScroll("message19");
      });

    }

    socket.on('message recieved', function(req){
      
      $scope.room_factory.addMessage(req);
      $scope.messages = $scope.room_factory.messages;
      $anchorScroll("bottom_message");
  
    });


    //*******************************************************************
    //* some functions that help with certain features in the website,  *
    //*          check each's comments to see what it does              *
    //*******************************************************************

    $scope.$watch('newMessage', function() {
      //**
      //this is here if we ever want to make the "typing..." notification
      //appear in a chatroom
      //for typing socket thingy, ignore for now
      //**
    });

    events.on('reset room', function(){
      //**
      //this listens to the 'reset room' event to see if the user wants to see the contents of
      //other room, this is emmited by the roomselect controller (roomselect.controller.js)
      //**
      room.getRoomData().then(function(res){ 
        $scope.uploader.url = "/upload/image/public/"+$location.search().room;
        $scope.room_factory = room; 
      });
    });


    //*******************************************************************************
    //* some jQuery functions that help with some features as well, they are pretty *
    //*                           self explanatory                                  *
    //*******************************************************************************

    $('#input_box').on('paste', function () {
      setTimeout(function () {
            
      }, 100);
    });

    $('.chatbubbletext').on('loaded', function(){
      $(this).addInputs($('.chatbubbletext').data('preview'));
      return true;
    });


  }


})();
//*******************************************************
//************* roomselect.controller.js ****************
//*******************************************************
//*                                                     *
//*    this source deals with all the functionality of  * 
//*  the left side menu, including room selection, room *
//*      swapping, changing the profile picture and     *
//*             chat background, etc                    *
//*                                                     *
//*******************************************************


(function(){

  'use strict';

  ///***controller for selecting rooms***
  angular
      .module('TaigaApp')
      .controller('RoomSelectController', [ '$scope'
                                          , '$http'
                                          , 'fetcher'
                                          , '$location'
                                          , '$state'
                                          , 'upload_factory' 
                                          , roomSelectController
                                          ]);


  function  roomSelectController( $scope
                                , $http
                                , fetcher
                                , $location
                                , $state
                                , upload_factory
                                ){
    // begin

    $scope.myCroppedImage   =   '';
    $scope.myImage          =   '';
    $scope.roomSearch       =   '';
    $scope.roomname         =   fetcher.roomname;   
    



    $scope.getColor         =   getColor;
    $scope.handleCropUpload =   upload_factory.basicFunctions($scope).handleCropUpload;
    $scope.handleUpload     =   upload_factory.basicFunctions($scope).handleUpload;
    $scope.logOut           =   logOut;
    $scope.selectRoom       =   selectRoom;
    $scope.setColor         =   setColor;
    $scope.uploader         =   upload_factory.init("room", $scope);

      
    fetcher.reloadData($scope);
                

    //***select one of the rooms on click***
    function selectRoom(room){
      // if(room.roomname != fetcher.getLastRoom()){
      $scope.room = room;
      //***sets your last room so that you are going to leave the socket for that room after the redirect***
      fetcher.setLastRoom(room.roomname);
            
      //***globally set the room in factory, this changes it in all controllers***        
      //***redirect***
      $location.url("?room=" + room.roomname);
      //$location.replace();
          
    }

    function logOut(){
      logOut();
    }

    function setColor(color){
      $http.post('/graph/setUserColor/'+color);
    }

    function getColor(username){
      return $http.get('/graph/getUserColor/'+username).then(function(res){
        return res.data;
      });
    }





    $scope.$on('$locationChangeSuccess', function(){

      fetcher.updateAll();

      var param = {
        roomname: $location.search().room,
        username: $scope.username,
        lastroom: fetcher.getLastRoom()
      }

      socket.emit('join room', param);

      if($location.search().room)
        $('.chat').removeClass('displayNone');
      else
        $('.chat').addClass('displayNone');

      fetcher.reloadData($scope); 
    })


    socket.on('user joined', function(req){
      fetcher.getRoomlist().then(function(response){ 
        $scope.roomlist = response; 
        events.emit('change room', {});  
      });         
    });


    $scope.$watch('profilePictureAddress', function() {
        $(".profileimg").attr("src", $scope.profilePictureAddress);
        $(".panelprofileimg").attr("src", $scope.profilePictureAddress);
    });


  }


})();
//*******************************************************
//************** userlist.controller.js *****************
//*******************************************************
//*                                                     *
//*    this source deals with all the details you see 	*
//*  displayed on the right panel of the app: the users *
//*  on that certain room, you can add friends, accept 	*
//*  		or reject friend requests, etc.				*					
//*														*
//*******************************************************





(function(){

	'use strict';

	//***handle room's userlist, friendlist, etc***
	angular
		.module('TaigaApp')
		.controller('UserListController', 	[ '$scope'
											, '$http'
											, '$q'
											, '$stateParams'
											,'room'
											, userlistController
											]);


	function  userlistController( $scope
								, $http
								, $q
								, $stateParams
								, room
								){
	 	
	 	// begin
	  	updateData();
	  
	    $scope.roomname 			= 	$scope.room.roomname;
	    $scope.type 				= 	$stateParams.type; 
	    $scope.username 			= 	$stateParams.username;


	    $scope.acceptFriendRequest 	= 	acceptFriendRequest;
	    $scope.joinEvent 			= 	joinEvent;
	    $scope.removeFriend         =	removeFriend;
	    $scope.rejectFriendRequest 	= 	rejectFriendRequest;
	    $scope.sendFriendRequest 	= 	sendFriendRequest;


		function sendFriendRequest(name){
			$http.post("/sendFriendRequest/"+name, {});
		}

		function acceptFriendRequest(name){
			$http.post("/acceptFriendRequest/"+name, {});
		}

		function rejectFriendRequest(name){
			$http.post("/rejectFriendRequest/"+name, {});		
		}

		function removeFriend(name){
			$http.post("/removeFriend/"+name, {});		
		}

		function joinEvent(eventName){
	        $http.post("/graph/joinEvent/", {id: eventName});
	        eventName = "";
	    }

	   	function updateData(){
		    $scope.room = room;
		    $scope.roomname = $scope.room.getRoomname();
		    room.getRoomData().then(function(res){ 
		    	$scope.room = res;
			    $scope.roomname = $scope.room.roomname;  		
		    	$scope.prettyname = $scope.room.prettyname; 
		    	$scope.userlist = res.usersOnline;
		    	room.getFriendRequestsData().then(function(response){$scope.friend_requests = response; });
		    	room.getFriendlist().then(function(response){$scope.friendlist = response; });
		    	document.sc = $scope;
		    });
		}
		

		socket.on('user joined', function(req){ 
			updateData();
		});


	    events.on('change room', function(){
	    	$('.chatview').scrollTop($('.chatview')[0].scrollHeight);
	    	updateData();
	    });
	}

})();

//****************************************************************************
//********************* contenteditable.directive.js *************************
//****************************************************************************
//*                                                                          *
//*      use the contenteditable div directive to make it possible for a     *
//*                        for a textbox-like div                            *                                                  *
//*                                                                          *
//****************************************************************************

(function(){

  'use strict';

  angular
      .module('TaigaApp')
      .directive('contenteditable', [ '$sce'
                                    , contentEditableDirective
                                    ]);


  //*************************************************
  //*           the directive's function            *
  //*************************************************

  function contentEditableDirective($sce) {
    return {
      restrict: 'A',                                      // only activate on element attribute
      require: '?ngModel',                                // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) return;                             // do nothing if no ng-model

        // Specify how UI should be updated
        ngModel.$render = function() {
          element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
        };

        // Listen for change events to enable binding
        element.on('blur keyup change', function() {
          scope.$evalAsync(read);
        });
        read();                                           // initialize

        // Write data to the model
        function read() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if ( attrs.stripBr && html == '<br>' ) {
            html = '';
          }
          ngModel.$setViewValue(html);
        }
      }
    };
  }


})();
//*******************************************************
//************** chatwindow.controller.js ***************
//*******************************************************
//*                                                     *
//*   this source is an angular hack in order to load   *
//*   jQuery after everything in the page has loaded it *
//*   won't work just by loading jQuery whenever we     *
//*   like to because it's not going to select certain  *
//*  elements that are loaded after the jQuery finished *  
//*                      executing                      * 
//*                                                     *
//*******************************************************

(function(){

	'use strict';

	//TODO: find a way to fix this without using hacks
	angular.module('TaigaApp').directive('dataload', function() {
	  return {
	       link: function(scope, element, attr) {
	          window.setTimeout(function() {
	             setTimeout(function(){jqueryUI(); },500);
	          });
	       }
	    }
	});

})();