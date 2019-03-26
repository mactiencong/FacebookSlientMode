function enableSlientMode(){
    // mercurymessagesCountValue
    let mercurymessages = document.getElementById('mercurymessagesCountValue')
    if(mercurymessages) mercurymessages.classList.add('hidden_elem')

    // requestsCountValue
    let requestsCount = document.getElementById('requestsCountValue')
    if(requestsCount) requestsCount.classList.add('hidden_elem')

    // notificationsCountValue
    let notificationsCount = document.getElementById('notificationsCountValue')
    if(notificationsCount) notificationsCount.classList.add('hidden_elem')

    //　ChatTabsPagelet
    let pageletDock = document.getElementById('pagelet_dock')
    if(pageletDock) pageletDock.style.display = 'none'
}

function enableSlientModeOnMobileVersion(){
    // messages_jewel
    let messages_jewel = document.getElementById('messages_jewel')
    if(messages_jewel) {
        messages_jewel.classList.remove('hasCount')
        messages_jewel.classList.add('noCount')
    }

    // notifications_jewel
    let notifications_jewel = document.getElementById('notifications_jewel')
    if(notifications_jewel) {
        notifications_jewel.classList.remove('hasCount')
        notifications_jewel.classList.add('noCount')
    }

    // requests_jewel
    let requests_jewel = document.getElementById('requests_jewel')
    if(requests_jewel) {
        requests_jewel.classList.remove('hasCount')
        requests_jewel.classList.add('noCount')
    }
}

function disableSlientMode(){
    //　ChatTabsPagelet
    let pageletDock = document.getElementById('pagelet_dock')
    if(pageletDock) pageletDock.style.display = ''
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.message == "FBSM_ENABLE") {
        enableSlientMode()
        enableSlientModeOnMobileVersion()
    } else if(request.message == "FBSM_DISABLE"){
        disableSlientMode()
    }
    return true
})