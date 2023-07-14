let BLOCKED_LIST = [];
let INTERVALL_ID = undefined;

async function getBlockedDomains() {
    result = await chrome.storage.local.get(["blocked_domains"])
    BLOCKED_LIST = result.blocked_domains;
}

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
    console.log("trying to block");
    const result = await chrome.storage.local.get(["running"]);
    if (result.running) {
        currentDomain = extractDomain(changeInfo.url);
        if (BLOCKED_LIST.includes(currentDomain)) {
            console.log("blocking:" + currentDomain);
            chrome.tabs.update(tabId, {url: "blocked/blocked.html"});
        }
    }
}

function storageChangeCallback(changes, area) {
    BLOCKED_LIST = changes.blocked_domains ? changes.blocked_domains.newValue : BLOCKED_LIST;
}

async function updateMilliseconds() {
    result = await chrome.storage.local.get(["running", "milliseconds"]);
    if (result.milliseconds > 0 && result.running) {
        let milliseconds = result.milliseconds - 1000;
        if (milliseconds <= 0) {
            milliseconds = 0;
            clearInterval(INTERVALL_ID);
            INTERVALL_ID = undefined;
            await chrome.storage.local.set({running: false});
        }
        await chrome.storage.local.set({milliseconds: milliseconds});
    }
}

async function messageCallback(message){
    if (message === "start-timer" && INTERVALL_ID === undefined) {
        INTERVALL_ID = setInterval(updateMilliseconds, 1000)
    }
    else if (message === "stop-timer"){
        clearInterval(INTERVALL_ID);
        INTERVALL_ID = undefined;
    } else return
}

async function restartTimerIfRunning(){
    const result = await chrome.storage.local.get(["running"]);
    if (result.running){
        messageCallback("start-timer");
    }
}

getBlockedDomains();
console.log(BLOCKED_LIST);
restartTimerIfRunning();
chrome.storage.onChanged.addListener(storageChangeCallback);
chrome.tabs.onUpdated.addListener(redirectCallback);
chrome.runtime.onMessage.addListener(messageCallback);