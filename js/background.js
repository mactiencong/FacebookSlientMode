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
    chrome.tabs.query({url: "*://*.facebook.com/*"}, function (tabs) {
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

let isEnable = false
function enable(){
    isEnable = true
    changeBadge()
    addListeners()
    setSlientAllFacebookTab()
    sendContentScriptMsg('FBSM_ENABLE')
}

disable()

function disable(){
    isEnable = false
    changeBadge()
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

chrome.browserAction.onClicked.addListener(function(tab) {
    if(isEnable) {
        disable()
    } else enable()
})

function reload(tab){
    chrome.tabs.reload(tab.id)
}

function reloadAllFacebookTab(){
    chrome.tabs.query({url: "*://*.facebook.com/*"}, function (tabs) {
        tabs.forEach(tab => {
            reload(tab)
        })
    })
}

function isFacebookTab(tab){
    try {
        let url = new URL(tab.url)
        let domain = url.hostname
        return domain.includes('facebook.com')
    } catch (error) {
        return false
    }
}

function setSlientAllFacebookTab(){
    chrome.tabs.query({url: "*://*.facebook.com/*"}, function (tabs) {
        tabs.forEach(tab => {
            renameFacebookTabTitle(tab)
            muteTab(tab)
        })
    })
}

function removeSlientAllFacebookTab(){
    chrome.tabs.query({url: "*://*.facebook.com/*"}, function (tabs) {
        tabs.forEach(tab => {
            unmuteTab(tab)
        })
    })
}

function changeBadge(){
    const badge = isEnable? 'silent': ''
    chrome.browserAction.setBadgeText({text: badge})
    chrome.browserAction.setBadgeBackgroundColor({color: '#F00'})
}

function muteTab(tab){
    chrome.tabs.update(tab.id, {muted: true});
}

function unmuteTab(tab){
    chrome.tabs.update(tab.id, {muted: false});
}

function renameFacebookTabTitle(tab){
    if(isEnable) chrome.tabs.executeScript(tab.id, {code:"document.title = 'Silent mode'"})
}

function newFacebookTabListener(details) {
    if (isFacebookTab(details)) enable()
}