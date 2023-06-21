let blockedList = [];

chrome.storage.local.get(['blocked_domains'])
    .then((result) => {
        blockedList = result.blocked_domains;
    })

let extractDomain = (url) => {
    try {
        let domain = new URL(url);
        domain = domain.hostname;
        return domain;
    }
    catch (e) {
        console.log(e);
    }
}

let getCallback = (result) => {
    blockedList = result.key;
}

let redirectCallback = (tabId, changeInfo, tab) => {
    currentDomain = extractDomain(changeInfo.url);
    console.log(currentDomain);
    if (blockedList.includes(currentDomain)){
        chrome.tabs.update(tabId, {url: "blocked/blocked.html"});
    }
}

let storageChangeCallback = (changes, area) => {
  blockedList = changes.blocked_domains.newValue;
}


chrome.storage.onChanged.addListener(storageChangeCallback);

chrome.storage.local.get(['blocked_domains'])
    .then((result) => {
        blockedList = result.blocked_domains;
    })
    
chrome.tabs.onUpdated.addListener(redirectCallback);