

module.exports = function(app, auth, dirname){

//***Routing***

app.get('/', auth.isAuth, function (req, res){
  res.sendFile(dirname + "/chat.html");
});

app.get('/register', function (req, res){
  res.sendFile(dirname + "/register.html");
});

app.get('/login', function (req, res){
  res.sendFile(dirname + "/login.html");
});

app.get('/reset', function (req, res){
  res.sendFile(dirname + "/reset.html");
});

app.get('*/img/:imagename', function (req, res){
  res.sendFile(dirname + "/img/"+req.params.imagename);
});

app.get('*/fonts/:imagename', function (req, res){
  res.sendFile(dirname + "/fonts/"+req.params.imagename);
});

app.get('*/video/:videoname', function (req, res){
  res.sendFile(dirname + "/video/"+req.params.videoname);
});

app.get('*/packages/:packagename', function (req, res){
  res.sendFile(dirname + "/packages/"+req.params.packagename);
});

app.get('*/node_modules/:folder/:filename', function (req, res){
  res.sendFile(dirname + "/node_modules/"+req.params.folder+"/"+ req.params.filename);
});

app.get('*/scripts/:scriptname', function (req, res){
  res.sendFile(dirname + "/scripts/"+req.params.scriptname);
});

app.get('*/partials/:partialfolder/:partialname', function (req, res){
  res.sendFile(dirname + "/partials/"+req.params.partialfolder+"/"+req.params.partialname);
});

app.get('*/img/emoji/:emojiname', function(req,res){
  res.sendFile(dirname + "/img/emoji/"+req.params.emojiname);
});

app.get('*/css/:stylename', function(req,res){
  res.sendFile(dirname + "/css/"+req.params.stylename);
});

app.get('*/auth/getUsername', auth.isAuth, function (req, res){
  var cookie_data = auth.getTokenData(req);
  res.send(cookie_data.username);
});


app.post('/addMessage', auth.isAuth, function (req, res){
  res.send("success");
});

//***Routing***

}