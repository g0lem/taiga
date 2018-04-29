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