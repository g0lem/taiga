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
