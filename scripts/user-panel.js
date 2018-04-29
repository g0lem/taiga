'use strict';



//***here we handle user settings***
app.controller('UserPanelController', ['$scope', '$http', 'FileUploader', '$location',   function($scope, $http, FileUploader, $location) {


    //***visual bullshit***  
	$scope.closeAllFields = function(){
	  $scope.show_password_field = 0;
	  $scope.show_image_field = 0;
	  $scope.show_bio_field = 0;
	}
	
	
	$scope.changePassword = function(){	
		$http.post("/changePassword", $scope.pass);
	}

	$scope.myImage='';
    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {
	    var file=evt.currentTarget.files[0];
	    var reader = new FileReader();
	    reader.onload = function (evt) {
		    $scope.$apply(function($scope){
		    	$scope.myImage=evt.target.result;
		    });
	    };
	    reader.readAsDataURL(file);
    };

    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

	$scope.handleCropUpload = function(){
 		var preparedJSON = {
 			endodedImage: $scope.myCroppedImage
 		};    
	    $http.post("/upload/profile/",  preparedJSON ).then(function(res){
	    		window.location.href = ("");
	    });
	}
}]);
