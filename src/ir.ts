const lirc = require('lirc-client')({
    host: '127.0.0.1',
    port: 8765
  });

  const iot = require("./iotcamera");
   
  lirc.on('receive', function (remote, button, repeat) {
      console.log('button ' + button + ' on remote ' + remote + ' was pressed!');
      if (button == "BUT_PLAY"){
        iot.takePhoto();
      }
  });