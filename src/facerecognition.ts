import fs from 'fs';
import path from 'path';
import * as cv from 'opencv4nodejs';

const basePath = './dist/data/';
const imgsPath = path.resolve(basePath, 'faces');
const nameMappings = ['stephan', 'sebastiaan'];

const imgFiles = fs.readdirSync(imgsPath);

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);

function processFaceRecognition() {
  // whatever
  const trainImgs = imgFiles
    // get absolute file path
    .map(file => path.resolve(imgsPath, file))
    // read image
    .map(filePath => cv.imread(filePath))
    // face recognizer works with gray scale images
    .map(img => img.bgrToGray())
    // detect and extract face
    .map(getFaceImage)
    // face images must be equally sized
    .map(faceImg => faceImg.resize(150, 150));
  // make labels
  const labels = imgFiles
    .map(file => nameMappings.findIndex(name => file.includes(name)));
  const lbph = new cv.LBPHFaceRecognizer();
  lbph.train(trainImgs, labels);

  const results = new Array();
  const picameraImg = cv.imread(path.resolve(basePath, 'camera/testimage.jpg'));
  const result = classifier.detectMultiScale(picameraImg.bgrToGray(), 1.3, 6, 0, new cv.Size(24, 24));
  const minDetections = 1;
  result.objects.forEach((faceRect, i) => {
    if (result.numDetections[i] < minDetections) {
      return;
    }
    const faceImg = picameraImg.getRegion(faceRect).bgrToGray();
    cv.imwrite(basePath + `recognition/testface${i}.jpg`, faceImg);

    results[i] = lbph.predict(faceImg);
    results[i].label = nameMappings[results[i].label];
    results[i].confidence = Math.trunc(results[i].confidence);

    drawRectangle(picameraImg, faceRect, results[i]);
  });
  cv.imwrite(basePath + 'recognition/testimage.jpg', picameraImg);
  return results;
};

function drawRectangle(picameraImg, faceRect, results) {
  const alpha = 0.4;
  const rect = cv.drawDetection(picameraImg, faceRect, { color: new cv.Vec3(255, 0, 0), segmentFraction: 4 });
  cv.drawTextBox(picameraImg, new cv.Point2(rect.x, rect.y + rect.height + 10), [{ text: results.label + "(" + results.confidence + ")" }], alpha);
}

const getFaceImage = (grayImg) => {
  const faceRects = classifier.detectMultiScale(grayImg).objects;
  if (!faceRects.length) {
    throw new Error('failed to detect faces in');
  }
  return grayImg.getRegion(faceRects[0]);
};

module.exports.processFaceRecognition = processFaceRecognition;