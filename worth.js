var stringSimilarity = require('string-similarity') 

module.exports = (checklist, labels) => {
    var worth = 0;
    console.log(labels);
    for (key in checklist) {
        if (checklist[key] == undefined || ["children", "teen", "adult"].includes(key)) {
            continue;
        }
        for (var i=0; i<labels.length; i++) {
            worth += stringSimilarity.compareTwoStrings(key.toLowerCase(), labels[i]['label'].toLowerCase())*labels[i]['score'];
        }
    }
    return worth/(0.3+worth);
}
