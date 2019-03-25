const url = chrome.runtime.getURL('../data/block_urls.json')
let block_urls = []
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        block_urls = data
    })
function isBlockUrl(details){
    for (let index = 0; index < block_urls.length; index++) {
        const urlPattern = block_urls[index]
        const isBlock = details.url.indexOf(urlPattern) !== -1
        if(isBlock) return true
    }
    return false
}

function sendContentScriptMsg(msg='FBSM_ENABLE'){
    chrome.tabs.query({url: "https://www.facebook.com/*"}, function (tabs) {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {message: msg})
        })
    })
}

function blockListener(details) {
    if(isBlockUrl(details)){
        return {cancel: true}
    }
}

let isEnable = true
function enable(){
    isEnable = true
    setEnableIcon()
    addListeners()
    setSlientAllFacebookTab()
    sendContentScriptMsg('FBSM_ENABLE')
}

function setEnableIcon(){
    chrome.browserAction.setIcon({
        path : "icon/enable.png"
    })
}

enable()

function disable(){
    isEnable = false
    setDisableIcon()
    removeListeners()
    removeSlientAllFacebookTab()
    reloadAllFacebookTab()
    sendContentScriptMsg('FBSM_DISABLE')
}

function removeListeners(){
    chrome.webRequest.onBeforeRequest.removeListener(blockListener)
    chrome.webNavigation.onCompleted.removeListener(newFacebookTabListener)
}

function addListeners(){
    chrome.webRequest.onBeforeRequest.addListener(
        blockListener,
        {urls: ["<all_urls>"]},
        ["blocking"]
    )
    chrome.webNavigation.onCompleted.addListener(newFacebookTabListener, { url: [{hostContains: '.facebook.'}] })
}

function setDisableIcon(){
    chrome.browserAction.setIcon({
        path : "icon/disable.png"
    })
}

chrome.browserAction.onClicked.addListener(function(tab) {
    if(isEnable) {
        disable()
    } else enable()
})

function reload(tab){
    chrome.tabs.reload(tab.id)
}

function reloadAllFacebookTab(){
    chrome.tabs.query({url: "https://www.facebook.com/*"}, function (tabs) {
        tabs.forEach(tab => {
            reload(tab)
        })
    })
}

function isFacebookTab(tab){
    try {
        let url = new URL(tab.url)
        let domain = url.hostname
        return domain==="www.facebook.com"
    } catch (error) {
        return false
    }
}

function setSlientAllFacebookTab(){
    chrome.tabs.query({url: "https://www.facebook.com/*"}, function (tabs) {
        tabs.forEach(tab => {
            renameFacebookTabTitle(tab)
            muteTab(tab)
        })
    })
}

function removeSlientAllFacebookTab(){
    chrome.tabs.query({url: "https://www.facebook.com/*"}, function (tabs) {
        tabs.forEach(tab => {
            unmuteTab(tab)
        })
    })
}

function muteTab(tab){
    chrome.tabs.update(tab.id, {muted: true});
}

function unmuteTab(tab){
    chrome.tabs.update(tab.id, {muted: false});
}

function renameFacebookTabTitle(tab){
    if(isEnable) chrome.tabs.executeScript(tab.id, {code:"document.title = 'Facebook Slient Mode'"})
}

function newFacebookTabListener(details) {
    if (isFacebookTab(details)) enable()
}