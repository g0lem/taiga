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