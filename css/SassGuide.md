#Sass Guide
---
##Folder Tree

```javascript

css
|
|-----elements
|     |-----animpack
|     |     |-----_animpack.scss
|     |     +-----_background-gradient.scss
|     |
|     |-----_browser-default-overwrite.scss
|     |
|     |-----_flatbox.scss
|     |
|     |-----_flex.scss
|     |
|     |-----_fonts.scss
|     |
|     |-----_variables.scss
|     |
|     +-----_xbrowser.scss
|
|-----fontawesome
|     |
|     |-----font-awesome scss files
|     |
|     +-----_font-awesome.scss
|
|-----chatpage.scss
|
|-----loginpage.scss
|
|-----chatpage.css
|
|-----loginpage.css
|
|-----chatpage.css.map
|
+-----loginpage.css.map

```

##File Legend

###Elements

####_animpack_

####_browser-default-overwrite_

####_flatbox_

####_flex_

####_fonts_

####_variables_

####_xbrowser_

###Fontawesome

####_font-awesome_

###Root

####_chatpage_

####_loginpage_

##Compilation Cycle

```

chatpage  |<-animpack  | <-background-gradient
loginpage |
          |<-font-awesome  | <-font-awesome scss files
          |
          |<-browser-default-overwrite
          |
          |<-flatbox
          |
          |<-flex
          |
          |<-fonts
          |
          |<-variables
          |
          |<-xbrowser

```