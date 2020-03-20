const { StillCamera } = require("pi-camera-connect");
const { Rotation } = require("pi-camera-connect");
import Fs from "fs";
import Jimp from 'jimp';
const Fr = require("./facerecognition");

const LCD = require('lcdi2c');
const lcd = new LCD(1, 0x27, 20, 4);

const stillCamera = new StillCamera({ rotation: Rotation.Rotate180 });

const storePath = "./dist/data/camera/";

 function takePhoto() {
        //your code
        stillCamera.takeImage().then(image => {

            lcd.clear().print('FOTO IS GENOMEN!');

            Fs.writeFileSync(storePath + "testimage.jpg", image);

            jimpRead(storePath + "testimage.jpg");

            const results = Fr.processFaceRecognition();

            printLCDResults(results);
        });
    };


// resize
function jimpRead(file) {

    Jimp.read(file, (err, image) => {
        if (err) throw err;
        image
            .scale(.5)
            .quality(80) // set JPEG q(uality
            .greyscale() // set greyscale
            .write(file); // save
    });

};

function printLCDResults(results) {

    lcd.clear();

    if (! Array.isArray(results)) {
        lcd.print('TECHNISCHE FOUT ! ');
    }
    else if (results.length == 0) {
        lcd.print('NIEMAND HERKEND ! ');
    } else {
        lcd.print('HERKEND ZIJN : ');
        results.forEach(function (element, index) {
            lcd.setCursor(0, index);
            lcd.print(element.label + "(" + element.confidence + ")");
        });

    }
}

module.exports.takePhoto = takePhoto;

