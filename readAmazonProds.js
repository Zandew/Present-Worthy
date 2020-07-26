// reading amazon products from output file goes here!
window.idx=1; //needs to be a global variable

window.read =function (){
    $.when($.getJSON(`amazon-scraper/apify_storage/datasets/amazon-dataset/${findFileName()}.json`)).then(function(data) {
        
        var title=data.title;
        //lists:
        var products=data.products.split(";");;
        var prices=data.prices.split("$"); //need to make sure not to include the first one
        prices=prices.slice(1);
        var imglinks=changeJSONtoList(data.imglinks); 
        var links=changeJSONtoList(data.links);
        console.log("prices", prices.length);
        console.log("links", links);
        console.log("imglinks", imglinks);
        console.log("products", products);
        if (prices.length==0){
            var elem=document.createElement('h4');
            elem.innerHTML="No search results found. ";
            document.getElementById('amazon-results').appendChild(elem); 
        }
        else{
            var length;
            if (imglinks.length<20){
                length=imglinks.length;
            }
            else{
                length=20;
            }
            for (let  i=0; i<length; i++){
                //div
                var div = document.createElement('div');
                div.setAttribute('class', 'amazon-prod');

                //img
                var img=document.createElement('img');
                img.setAttribute('src', imglinks[i]);
                img.setAttribute('class', 'amazon-img');

                img.setAttribute('class', 'img-class-name');

                //h1
                var name=document.createElement('h4');
                name.innerHTML=products[i];
                name.setAttribute('class', 'amazon-name');
                
                //a
                var link=document.createElement('a');
                link.setAttribute('href', "https://www.amazon.com/"+links[i]);
                link.setAttribute('class', 'amazon-link');

                //p
                var price=document.createElement('p');
                price.innerHTML="$"+prices[i];
                price.setAttribute('class', 'amazon-price');

                link.appendChild(name)

                div.appendChild(img);
                div.appendChild(link);
                div.appendChild(price);
                document.getElementById('amazon-results').appendChild(div);  //the div id must be this!!!
            }
        }  
    });
}

function changeJSONtoList(json){
    var list=[]
    $.each(json, function(i) {
        list.push(json[i]);
    });
    return list;
}

function findFileName(){
    var id_elm= document.getElementById('find-idx')
    var str = "" + id_elm.innerHTML;
    var pad = "000000000";
    var ans = pad.substring(0, pad.length - str.length) + str;
    console.log("fileval: ", ans);
    return ans
}