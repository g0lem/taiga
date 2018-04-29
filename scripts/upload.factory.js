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