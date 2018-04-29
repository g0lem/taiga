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