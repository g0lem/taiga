var multer = require('multer');
var fs = require('fs');
var uuid = require('node-uuid');
var md5File = require('md5-file');
var Grid = require("gridfs-stream");



//**Upload Setup**
var storage = multer.diskStorage({
  //multers disk storage settings
  // destination: function (req, file, cb){
  //     cb(null, __dirname + '/images/chat')
  // },
  filename: function (req, file, cb){
    var datetimestamp = Date.now();
    var name = uuid.v4();
    cb(null, name + '-' + datetimestamp + ('.' + file.originalname.split('.')[file.originalname.split('.').length -1]).toLowerCase());
  }
});
var upload = multer({storage: storage});
//**Upload Setup**



module.exports = function(app, auth, mongoose, io){

  Grid.mongo = mongoose.mongo;

  var gfs = Grid(mongoose.connection.db);
  var Room = mongoose.model('Room');


  //+++ DON'T ABIDE DESIGN RULES. TO FIX +++
  app.post('/upload/image/:type/:roomname',upload.single('file'), auth.isAuth, function (req, res) {

    var tim = new Date();

    var video_extensions = [".wav", ".webm", ".ogg", ".mp3", ".mp4", ".flac", ".3gp", ".flv"];
    var image_extensions = [".png", ".jpg", ".jpeg", ".gif"];


    //**checking what's the file's hash**
    var file_name_lel = req.file.filename;
    var file_extension ='.' + req.file.filename.split('.')[req.file.filename.split('.').length -1];
    var file_to_upload = req.file;
    file_to_upload.metadata = "chat";

    console.log(file_extension);


    md5File(file_to_upload.path, function(error, hash){

      gfs.findOne({ md5: hash }, function (err, file) {

        var file_extension = ('.' + file_name_lel.split('.')[file_name_lel.split('.').length -1]).toLowerCase();
        var cookie_data = auth.getTokenData(req);

        if(video_extensions.indexOf(file_extension) == -1){
          file_type = "image";
        } 
        else {
          file_type = "video";
        }

        var _Schema = Room;

        if(err){
          res.send(err);
        }
        else if(file){

          var preparedJSON={
            "username" : req.cookies.username,
            "roomname": req.params.roomname,
            "userid":"57d6cef6bce0ff1da0f3442e",
            "body": file.filename,
            "timestamp":Date.now(), //getTimestamp()
            "message_type": file_type
          };

          _Schema.where({ roomname: req.params.roomname.toLowerCase() }).update({ $push : {messages:  { username: cookie_data.username , userid: mongoose.Types.ObjectId("57d6cef6bce0ff1da0f3442e"), body: file.filename, timestamp: Date.now(),  message_type: file_type}}},
            function(err, result) {                 
              // console.log(err);
              if(err)
                res.send(err);
              else{ 
                io.to(req.params.roomname.toLowerCase()).emit('message recieved', preparedJSON);
                res.send(preparedJSON);                             
              }
          });
        } 
        else {
          var writestream = gfs.createWriteStream(file_to_upload);
          var stream = fs.createReadStream(file_to_upload.path).pipe(writestream);

          var preparedJSON={
            "username" : cookie_data.username.toLowerCase(),
            "roomname": req.params.roomname,
            "userid":"57d6cef6bce0ff1da0f3442e",
            "body": file_name_lel,
            "timestamp":Date.now(), //getTimestamp()
            "message_type": file_type
          };

          stream.on('close', function(){
            _Schema.where({ roomname: req.params.roomname.toLowerCase() }).update({ $push : {messages:  { username: cookie_data.username , userid: mongoose.Types.ObjectId("57d6cef6bce0ff1da0f3442e"), body: file_name_lel, timestamp: Date.now(),  message_type: file_type}}},
              function(err, result) {
                if(err)
                  res.send(err);
                  else{ 
                    io.to(req.params.roomname.toLowerCase()).emit('message recieved', preparedJSON);
                    res.send(preparedJSON);                             
                  }
            });
          });
        }
      });
    });
  });
        

  app.post('/upload/background/',upload.single('file'), auth.isAuth, function (req, res) {

      var image_extensions = [".png", ".jpg", ".jpeg", ".gif"];

      //**checking what's the file's hash**
      var file_name_lel = req.file.filename;
      var file_extension ='.' + req.file.filename.split('.')[req.file.filename.split('.').length -1];

      var file_to_upload = req.file;
      file_to_upload._id = "bg-"+req.cookies.username.toLowerCase();
      file_to_upload.filename = "bg-"+req.cookies.username.toLowerCase();
      file_to_upload.metadata = "background";

             
      var file_extension = ('.' + file_name_lel.split('.')[file_name_lel.split('.').length -1]).toLowerCase();

      if(image_extensions.indexOf(file_extension) != -1){

        var writestream = gfs.createWriteStream(file_to_upload);
        var stream = fs.createReadStream(file_to_upload.path).pipe(writestream);
        stream.on('finish', function () { res.send("success"); });    
      } 
           
  });


  app.post('/upload/profile/', auth.isAuth, function (req, res) {

    //***loading cookie data so we can get our username***
    var cookie_data = auth.getTokenData(req); //LOAD COOKIE DATA
    var base64Data = {};
    //***we are making the file a png in base64, it can be anything, but we must tell the system that it's an image***
    var tmp_file = req.body.endodedImage.replace(/^data:image\/png;base64,/, ""); 
    //   because we only have the image in our server's ram, we will have to write the file on the disk first, we can't really
    //   parse a full file, like we did with the images inside the chatroom, because this image has been cropped, and we will
    //   only take certain bytes from the full image. We don't have this image stored anywhere, so I can't pipe it to MongoDB,
    //   I could find a way to createReadStream from a byte array, but it's going to create a file anyway, so it's better this way
    if (!fs.existsSync(__dirname + "/tmp/")){
      fs.mkdirSync(__dirname + "/tmp/");
    }
      fs.writeFile(__dirname + "/tmp/"+cookie_data.username,  tmp_file , 'base64', function(err) {

        base64Data.file = tmp_file;
        base64Data.filename = "profile-"+cookie_data.username.toLowerCase();
        base64Data.metadata = "profile";
        base64Data._id = "profile-"+cookie_data.username.toLowerCase();

        //***create a write stream to GridFS (MongoDB)***
        var writestream = gfs.createWriteStream(base64Data);
        //***stream the data from the disk***
        var stream = fs.createReadStream(__dirname + "/tmp/"+cookie_data.username, base64Data).pipe(writestream);
          stream.on('close', function(){
            //***after you wrote everything in the DB, delete the data on the disk***
            fs.unlink(__dirname + "/tmp/"+cookie_data.username, function(){
              res.send("uploaded");
            });                         
          });
      });
  });


app.get('*/image/:metadata/:filename', function (req, res){

  // res.sendFile(__dirname + "/images/chat/"+req.params.imagename);
  // var video_extensions = [".wav", ".webm", ".ogg", ".mp3", ".mp4", ".flac"];
  // var file_name = req.params.imagename;

  // var file_extension = '.' + req.params.imagename.split('.')[req.params.imagename.split('.').length -1];

  // var fs_write_stream = fs.createWriteStream(__dirname + "/images/chat/imagez"+file_extension);
  var readstream = gfs.createReadStream({filename: req.params.filename.toLowerCase(), metadata: req.params.metadata});

  readstream.pipe(res);

  readstream.on('error', function(err){
    res.sendFile(__dirname + "/img/" + req.params.metadata );
  });

  //res.sendFile(readstream);
  // fs.access(__dirname + "/images/"+req.params.location+ "/"+req.params.imagename, fs.F_OK, function(err){
  //     if (!err){
  //       res.sendFile(__dirname + "/images/"+req.params.location+ "/"+req.params.imagename);
  //     }
  // else {
  //         //if(location  === "profile") da-i default profile pic
  //         res.sendFile(__dirname + "/img/" + req.params.location );
  //     }
  // });
  // }

});

app.get('*/image/background/', function (req, res){

  // var fs_write_stream = fs.createWriteStream(__dirname + "/images/chat/imagez"+file_extension);
  var readstream = gfs.createReadStream({filename: "bg-"+req.cookies.username.toLowerCase(), metadata: "background"});

  readstream.pipe(res);

  readstream.on('error', function(err){
    res.sendFile(__dirname + "/img/chatbg.png");
  });

});




};

