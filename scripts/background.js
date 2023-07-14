let blockedList = [];


function getCallback(result) {
    blockedList = result.blocked_domains;
}

chrome.storage.local.get(["blocked_domains"])
    .then(getCallback)

function extractDomain(url) {
    try {
        let domain = new URL(url);
        domain = domain.hostname;
        return domain;
    }
    catch (e) {
        console.log(e);
    }
}

async function redirectCallback(tabId, changeInfo, tab) {
    const running = await chrome.storage.local.get(["running"])
    if (!running){
        return;
    }
    currentDomain = extractDomain(changeInfo.url);
    console.log(currentDomain);
    if (blockedList.includes(currentDomain)){
        chrome.tabs.update(tabId, {url: "blocked/blocked.html"});
    }
}

function storageChangeCallback(changes, area) {
  blockedList = changes.blocked_domains ? changes.blocked_domains.newValue : blockedList;
}