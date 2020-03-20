import express from 'express';
import path from 'path';
const app = express();

app.listen(3000, function(){
  console.log("Listening on port 3000!")
});

//app.get('/', function(req, res){
//  res.sendFile('/home/pi/nodejs/dist/data/recognition/testimage.jpg');
//}); 

app.get('/recognition/:name', function (req, res, next) {
  var options = {
    root: path.join(__dirname, 'data/recognition/'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  var fileName = req.params.name
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})
