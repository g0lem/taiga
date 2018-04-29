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