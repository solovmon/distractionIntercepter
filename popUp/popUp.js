async function getBlockedDomains() {
    let result = await chrome.storage.local.get(["blocked_domains"])
    let blockedList = result.blocked_domains;
    return blockedList;
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

async function getCurrentDomain() {
    let queryOptions = { active : true, lastFocusedWindow: true};
    let tabs = await chrome.tabs.query(queryOptions);
    let currentTab = tabs[0];
    let url = currentTab.url;
    let domain = extractDomain(url);
    return domain;
}

async function displayContent(){
    const blockedDomains = await getBlockedDomains();
    const currentDomain = await getCurrentDomain();
    displayCurrentDomain(currentDomain, blockedDomains);
    displayBlockedDomains(blockedDomains);
}

async function displayCurrentDomain(currentDomain, blockedList) {
    document.getElementById("currentDomain").innerHTML = `${currentDomain || "error" }`;

    const status = document.getElementById("status");

    if (blockedList.includes(currentDomain)) {
        status.classList.replace("green", "red");
    }
    else {
        status.classList.replace("red", "green");
    }
}

async function displayBlockedDomains( blockedList ) {
    const listElement = document.getElementById("blockedList");
    listElement.innerHTML = "";
    blockedList.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        const removeButton = document.createElement("button");
        removeButton.addEventListener('click', () => {
            blockedList.splice(index, 1);
            updateBlockedList(blockedList);
            displayContent();
        });
        listItem.appendChild(removeButton);
        listElement.appendChild(listItem);
    })
}

async function blockCurrentDomain() {
    const currentDomain = await getCurrentDomain();
    let blockedList = await getBlockedDomains();
    if (blockedList.includes(currentDomain)) {
        return;
    }
    else {
        blockedList.push(currentDomain);
        await chrome.storage.local.set({blocked_domains: blockedList});
        displayContent();
    }
}

async function updateBlockedList(blockedList) {
    await chrome.storage.local.set({blocked_domains: blockedList});
}

function convertDisplayTimeToMs(displayTime){
    const timeValues = displayTime.split(":");
    const milliseconds = timeValues[0] * 60000 + timeValues[1] * 1000;
    return milliseconds;
}

function convertMsToDisplayTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = (milliseconds%60000) / 1000;
    const displayTime = `${(minutes/10 >= 1 ? minutes : "0" + minutes)}:${(seconds/10 >= 1 ? seconds : "0" + seconds)}`
    return displayTime;
}

async function toggleTimer() {
    const button = document.getElementById("toggleTimer");
    const result = await chrome.storage.local.get(["running"]);
    const input = document.getElementById("input");

    if ( !result.running && button.innerHTML === "on") {
        button.innerHTML = "off";
        button.classList.replace("green", "red")
        const milliseconds = convertDisplayTimeToMs(input.value);
        await chrome.storage.local.set( {running: true, milliseconds: milliseconds} );
        input.disabled = true;
        chrome.runtime.sendMessage("start-timer");
    }
    else {
        button.innerHTML = "on";
        button.classList.replace("red", "green")
        await chrome.storage.local.set( {running: false} );
        input.disabled = false;
        chrome.runtime.sendMessage("stop-timer");
    }
}

async function displayTimerButton() {
    const result = await chrome.storage.local.get(["running"]);
    const button = document.getElementById("toggleTimer");
    if (result.running) {
        button.innerHTML = "off";
        button.classList.add("red")
    }
    else {
        button.innerHTML = "on";
        button.classList.add("green")
    }
}

async function displayTimer() {
    const result = await chrome.storage.local.get(["milliseconds", "running"]);
    const displayTime = result.milliseconds ? convertMsToDisplayTime(result.milliseconds) : "00:00";
    const input = document.getElementById("input");
    input.value = displayTime;
    if(result.running){
        input.disabled = true;
    } 
    else {
        input.disabled = false;
    }
}

function storageChangeCallback(changes, area) {
    if (changes.milliseconds) {
        displayTimer();
        displayTimerButton();
    }
}

displayTimer();
displayTimerButton();
document.addEventListener("DOMContentLoaded", displayContent);
document.getElementById("block").addEventListener("click", blockCurrentDomain);
document.getElementById("toggleTimer").addEventListener("click", toggleTimer);
chrome.storage.onChanged.addListener(storageChangeCallback);