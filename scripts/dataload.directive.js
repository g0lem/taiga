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