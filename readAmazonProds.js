// reading amazon products from output file goes here!
window.idx=1; //needs to be a global variable

window.read =function (){
    $.when($.getJSON(`amazon-scraper/apify_storage/datasets/amazon-dataset/${findFileName()}.json`)).then(function(data) {
        var title=data.title;
        //lists:
        var products=data.products.split(";");;
        var prices=data.prices.split("$"); //need to make sure not to include the first one
        var imglinks=changeJSONtoList(data.imglinks); 
        var links=changeJSONtoList(data.links);

        for (let  i=0; i<imglinks.length; i++){
            //div
            var div = document.createElement('div');
            div.setAttribute('class', 'amazon-prod');

            //img
            var img=document.createElement('img');
            img.setAttribute('src', imglinks[i]);

            //h1
            var name=document.createElement('h1');
            name.innerHTML=products[i];
            
            //a
            var link=document.createElement('a');
            link.setAttribute('href', links[i]);

            //p
            var price=document.createElement('p');
            price.innerHTML=prices[i];

            name.appendChild(link)

            div.appendChild(img);
            div.appendChild(name);
            div.appendChild(price);
            document.getElementById('amazon-results').appendChild(div);  //the div id must be this!!!
        }

       
    });
}

function changeJSONtoList(json){
    var list=[]
    $.each(imglinks, function(img) {
        list.push(img);
    });
    return list;
}

function findFileName(){
    var str = "" + idx;
    var pad = "0000";
    var ans = pad.substring(0, pad.length - str.length) + str;
    console.log("fileval: ", ans);
    return ans
}