const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const vision = require('@google-cloud/vision');
const fileUpload = require('express-fileupload');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(fileUpload());

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'APIKEY.json'
});

// Performs label detection on the image file
/*client
  .labelDetection('./present.jpg')
  .then(results => {
    const labels = results[0].labelAnnotations;

    console.log('Labels:');
    labels.forEach(label => console.log(label));
    //console.log(results);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
*/

//main page
app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html');
});

//post request from submitting image
app.post('/submit', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(__dirname+'/present.jpg', function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));

