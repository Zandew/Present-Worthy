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
  keyFilename: 'APIKey.json'
});

//main page
app.get('/', (req, res) => {
  res.render('index.ejs');
});

//post request from submitting image
app.post('/submit', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file;
  let type = sampleFile.mimetype;
  if (type.substring(0, type.indexOf("/")) != "image") {
    return res.status(500).send("Not an image");
  }

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(__dirname+'/present.jpg');
  var checklist = {
    "children": req.body.children,
    "teen": req.body.teen,
    "adult": req.body.adult,
    "foodRelated": req.body.foodRelated,
    "giftBasket": req.body.giftBasket,
    "bDayCards": req.body.bDayCards,
    "booksMovies": req.body.booksMovies,
    "colors": req.body.colors,
    "sports": req.body.sports,
    "music": req.body.music,
    "art": req.body.art
  }

  //performs label detection
  client
  .labelDetection('./present.jpg')
  .then(results => {

    const labels = results[0].labelAnnotations;

    var labelList = [];
    labels.forEach(label => {
      labelList.push({
        "label": label['description'],
        "score": label['score']
      });
    });

    var worthiness = 1234; //foo(checklist, labelList);
    res.render('results.ejs', {worthiness: worthiness});
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));

