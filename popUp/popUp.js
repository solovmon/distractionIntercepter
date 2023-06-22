async function getBlockedDomains() {
    let result = await chrome.storage.local.get(["blocked_domains"])
    let blockedList = result.blocked_domains;
    console.log(blockedList);
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

async function displayCurrentDomain() {
    const currentDomain = await getCurrentDomain();
    console.log(currentDomain);
    document.getElementById("currentDomain").innerHTML = `${currentDomain || "error"}`;

    const blockedList = await getBlockedDomains();
    const statusEmoji = document.getElementById("statusEmoji");

    if (blockedList.includes(currentDomain)) {
        statusEmoji.innerHTML = "&#128308;"
    }
    else {
        statusEmoji.innerHTML = "&#128994;";
    }
}

async function blockCurrentDomain() {
    const currentDomain = await getCurrentDomain();
    let blockedList = await getBlockedDomains();
    blockedList.push(currentDomain);
    await chrome.storage.local.set({blocked_domains: blockedList});
    displayCurrentDomain();
}

document.addEventListener("DOMContentLoaded", displayCurrentDomain);
document.getElementById("block").addEventListener("click", blockCurrentDomain);