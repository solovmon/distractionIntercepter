let blockedList = [];
let INTERVALL_ID = undefined;

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
    const result = await chrome.storage.local.get(["running"]);

    if (result.running) {
        currentDomain = extractDomain(changeInfo.url);
        console.log(currentDomain);
        if (blockedList.includes(currentDomain)) {
            chrome.tabs.update(tabId, {url: "blocked/blocked.html"});
        }
    }
}

function storageChangeCallback(changes, area) {
  blockedList = changes.blockedList ? changes.blocked_domains.newValue : blockedList;
}

async function updateMilliseconds() {
    result = await chrome.storage.local.get(["running", "milliseconds"]);
    if (result.milliseconds > 0 && result.running) {
        let milliseconds = result.milliseconds - 1000;
        if (milliseconds <= 0) {
            milliseconds = 0;
            clearInterval(INTERVALL_ID);
            await chrome.storage.local.set({running: false});
        }
        await chrome.storage.local.set({milliseconds: milliseconds});
    }
}

async function messageCallback(message){
    if (message === "start-timer") {
        INTERVALL_ID = setInterval(updateMilliseconds, 1000)
    }
    else if (message === "stop-timer"){
        clearInterval(INTERVALL_ID);
    } else return
}

chrome.storage.onChanged.addListener(storageChangeCallback);
chrome.tabs.onUpdated.addListener(redirectCallback);
chrome.runtime.onMessage.addListener(messageCallback);