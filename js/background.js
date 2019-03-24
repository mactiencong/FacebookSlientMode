browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        if(isBlockUrl(details)){
            return {cancel: true}
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);
const url = browser.runtime.getURL('../data/block_urls.json');
let block_urls = []
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        ads_urls = data
    });
function isBlockUrl(details){
    for (let index = 0; index < block_urls.length; index++) {
        const urlPattern = block_urls[index]
        const isBlock = details.url.indexOf(urlPattern) !== -1
        if(isBlock) return true
    }
    return false
}