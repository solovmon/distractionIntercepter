getCurrentTab = async () => {
    let queryOptions = { active: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

var div = document.getElementsByClassName("domainName")[0];

getCurrentTab().then((tab)=>{
    div.innerHTML = tab.url.split('/')[2];
})

var emoji = document.getElementsByClassName("statusEmoji")[0];
emoji.innerHTML = '&#128213;';

// green book: &#128215;
// red book: &#128213;  