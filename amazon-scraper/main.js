const Apify = require('apify');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

function clean (string){
    string=string.trim();
    string=string.replace(/\s{2,}/g,";"); //white space
    string = string.replace(/(\r\n|\n|\r)/gm, ""); //new lines
    return string;
}

Apify.main(async () => {
    const input = await Apify.getValue('INPUT')
    const dataset = await Apify.openDataset('amazon-dataset');

    // Object from `./apify_storage/key_value_stores/default/INPUT.json`
    if (!input || !input.keyword) throw new Error('INPUT must contain a keyword!')

    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: `https://www.amazon.com/s/?field-keywords=${input.keyword}!` });

    const handlePageFunction = async ({ request, $ }) => {
        const title = $('title').text();
        
        //now, get all the info:
        var products = $('.a-section h2').text();
        const prices=$('.a-price').text();
        const links = $('.a-section div h2 a[href]')
            .map((i, el) => $(el).attr('href'))
            .get();

        const imglinks=  $('.s-image[src^="https://m.media-amazon.com/images"]')
            .map((i, el) => $(el).attr('src'))
            .get()

        dataset.pushData({ title: title, products: clean(products), prices: prices, imglinks: imglinks, links: links});
        console.log(`The title is: ${title}.`);
    };

    // Set up the crawler, passing a single options object as an argument.
    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageFunction,
    });

    await crawler.run();
});