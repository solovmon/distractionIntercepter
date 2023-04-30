'use strict';

chrome.webNavigation.onBeforeNavigate.addListener((details) =>{
    console.log(details.url);
    if (details.url.includes('twitter.com')){
        console.log('xd');
    }
});
  