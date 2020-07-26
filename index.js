const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const vision = require('@google-cloud/vision');
const fileUpload = require('express-fileupload');
//const { exec } = require("child_process");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
//const { window } = JSDOM.window;
//const { document } = window.document;

const fs = require('fs');
const process = require('process'); 
const util = require('util');
var index=0;

var path = require("path");
const exec = util.promisify(require('child_process').exec);

//remove previous dataset files(so they don't override new window)
async function remove() {
  const { stdout, stderr } = await exec('rm -r amazon-scraper/apify_storage/datasets/amazon-dataset/');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}
remove();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(fileUpload());
app.engine('html', require('ejs').renderFile);

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'APIKey.json'
});

app.use(express.static( '**/**'))
app.use(express.static( 'views/'))

//main page
app.get('/', (req, res) => {
  res.sendFile(__dirname+"/views/index.html");
});


//results page
app.get('/results', (req, res) => {
  res.render(__dirname+"/views/results.html", {worthiness: "N/A", index: 0});
});

app.get("**/**", function (req, res) {
  console.log("AAA: " + req.path);
  res.sendFile(path.join(__dirname, req.path));
});

//post request from submitting image
app.post('/submit', (req, res) => {
  console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.img;

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
  keyword = ""

  for (var key in checklist) {
    if (checklist[key] != undefined) {
      keyword += key+" ";
    }
  }
  console.log("keyword: ", keyword);

  var data= {
    keyword: keyword,
  }
  //JSON write
  let dataJSON = JSON.stringify(data);
  fs.writeFileSync('amazon-scraper/apify_storage/key_value_stores/default/INPUT.json', dataJSON);

  

  //preform webscraping
  async function scrape() {
    //loading sign ...
    /*
    const dom = new JSDOM(``, {
      url: "http://localhost:3000/",
      referrer: "http://localhost:3000/",
      contentType: "text/html",
      includeNodeLocations: true,
      storageQuota: 10000000
    });
    const loading  =dom.window.document.getElementById("loading-sign"); 
    console.log("loading: ", loading);
    loading.style.cssText=`
      display: block;
    `;*/
    const { stdout, stderr } = await exec('cd amazon-scraper && apify run --purge');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    /*
    loading.style.cssText=`
      display: none;
    `;
    */

    //now, render
    index=index+1;//next dataset
    res.render(__dirname+"/views/results.html", {worthiness: 1234, index:index});
  }
  scrape();


  //performs label detection
  /*client
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
    res.sendFile(__dirname+"/views/results.html");
  })
  .catch(err => {
    console.error('ERROR:', err);
  });*/
  
});

app.listen(process.env.PORT || 3000, () => console.log('Server running on http://localhost:3000'));