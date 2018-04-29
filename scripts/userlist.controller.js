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
