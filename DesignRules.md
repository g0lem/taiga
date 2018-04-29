#Rules for Code Design
---
###Node Syntax for Big Code Blocks
####Spaces and Titles
* Use three asterisks (*) to define main titles for __big code blocks__ at the beginning and ending of the title. Place the title tags at the beginning and end of the code like so:
```javascript
//***Main Functions***
var trigger1 = function myFunction1(){
  ...
}
var trigger2 = function myFunction2(){
  ...
}
//***Main Function***
```
* Use three endlines after each __big code block__.
* For sub-titles use two asterisks, for sub-sub-titles use one asterisk.
* For small blocks, predefine the functionality at the beginning. Use one space to separate small blocks like so:
```javascript
//Function to add numbers
function addMyNumbers(){
  ...
}

//Function to subtract nubmers
function subtractMyNumbers(){
  ...
}
```
* For medium blocks (with sub-titles or sub-sub-titles) separate them with two spaces like so:
```javascript
//***Main Functions***
//**Some Medium Block 1**
function myFunction1(){
  ...
}
//**Some Medium Block 1**


//**Some Medium Block 2**
function myFunction2(){
  ...
}
//**Some Medium Block 2**


//**Some Medium Block 3**
//*Some Medium sub-sub-title Block 1*
function myFunction3(){
  ...
}
//*Some Medium sub-sub-title Block 1*


//*Some Medium sub-sub-title Block 2*
function myFunction4(){
  ...
}
//*Some Medium sub-sub-title Block 2*


//*Some Medium sub-sub-title Block 3*
function myFunction5(){
  ...
}
//*Some Medium sub-sub-title Block 3*
//**Some Medium Block 3**
//***Main Function***
```

####Syntax Form
* __Always__ use brackets when using if, for, while, etc. like such:
```javascript
if(something)(){
  oneLineOfCode();
}
while(!somethingElse){
  onlyOneLineOfCodeButStillUsingBrackets();
}
```
* Use spaces. If spaces aren't used, try to convert them. Sublime has an automatic tab to space option.
* Put and endline between a closing if statement bracket and the beginning of an else block, as such:
```javascript
if(something){
  ...
}
else{
  ...
}
```
* Please indent accordingly. Act as if you were programming in python and the compiler was an actual python that would strangle you if you got an error.
* Each indent is __TWO SPACES AND TWO SPACES ONLY__. One time I had a 6 space indent nightmare but then I woke up and realized it was actually Taiga code.
* Do not use excess of endlines AND do not put code too close together. One endline is enough.


####Comment Guidelines
* Stop using memes in code.
* Don't use caps unless it's a piece of code you're working on and it isn't finished yet and if that's the case, use a "!~ ~!" sign as follows:
```javascript
//!~FUNCTION THAT ADDS USERS TO THE DATABASE~!
function addUsersToDatabase(){
  ...
}
```
* If you have a To-Do, add a "TODO: " tag at the beginning of the comment, like such:
```javascript
function someFunction(){
  //TODO: Write the function
}
```
* Comments must not be longer than 140 characters WITH indentation.