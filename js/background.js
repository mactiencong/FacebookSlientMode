const url = chrome.runtime.getURL('../data/block_urls.json');
let block_urls = []
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        block_urls = data
    });
function isBlockUrl(details){
    for (let index = 0; index < block_urls.length; index++) {
        const urlPattern = block_urls[index]
        const isBlock = details.url.indexOf(urlPattern) !== -1
        if(isBlock) return true
    }
    return false
}

function block(details) {
    if(isBlockUrl(details)){
        return {cancel: true}
    }
}

let isEnable = true
function enable(){
    isEnable = true
    setEnableIcon()
    chrome.webRequest.onBeforeRequest.addListener(
        block,
        {urls: ["<all_urls>"]},
        ["blocking"]
    );
}

function setEnableIcon(){
    chrome.browserAction.setIcon({
        path : "icon/enable.png"
    });
}

enable()

function disable(){
    isEnable = false
    setDisableIcon()
    chrome.webRequest.onBeforeRequest.removeListener(block)
    reloadFacebookTab()
}

function setDisableIcon(){
    chrome.browserAction.setIcon({
        path : "icon/disable.png"
    });
}

chrome.browserAction.onClicked.addListener(function(tab) {
    if(isEnable) {
        disable()
    } else enable()
});

function reloadFacebookTab(){
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
            let url = new URL(tab.url)
            let domain = url.hostname
            if(domain==="www.facebook.com"){
                chrome.tabs.reload(tab.id)
            }
        })
    });
}