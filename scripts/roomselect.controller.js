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