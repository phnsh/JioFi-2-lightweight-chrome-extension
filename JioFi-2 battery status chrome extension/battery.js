'use strict'

let domParser = new window.DOMParser();

var temp = 0;

const batteryXMLAPI = "http://jiofi.local.html/mark_title.w.xml";

let batteryDetailsResponse = {
    response: "ok",
    percentage: "NA"
}

// refresh battery percentage badge count only if there is a change in the % value
// polling every 5 seconds
function refreshBatteryPercentage() {
    var refreshId = setInterval(() => {
        
        fetchBatteryPercentage();            
        
        if(batteryDetailsResponse.response === "error") {
            //clearInterval(refreshId);
            temp = 0;
        } else {
            if(batteryDetailsResponse.percentage != temp) {
                setBadgeDetails(batteryDetailsResponse.percentage);
                temp = batteryDetailsResponse.percentage;
            }                
        }
    }, 5000);
}

// fetch from the API

function fetchBatteryPercentage() {
    fetch(batteryXMLAPI)
        .then((resp) => resp.text())
        .then((xmlResp) => domParser.parseFromString(xmlResp, "text/xml"))
        .then((data) => {
            batteryDetailsResponse["percentage"] = data.getElementsByTagName("batt_per")[0].childNodes[0].nodeValue;
            batteryDetailsResponse["response"] = "ok";
        })
        .catch(err => {
            batteryDetailsResponse["response"] = "error";
            setBadgeDetails("NA");
        });
}

// wake up extension on load
/*
* Listen to the runtime.onInstalled event to initialize an extension on installation
* docs: https://developer.chrome.com/extensions/background_pages
* pend: fix fetch network change error: ERR_NAME_NOT_RESOLVED
*
*/
chrome.runtime.onInstalled.addListener(function onClickListener() {
    try {
        fetchBatteryPercentage();
        setTimeout(() => {
            setBadgeDetails(batteryDetailsResponse.percentage)
        }, 1000);
        
        refreshBatteryPercentage();
        
    } catch (err) {
        setBadgeDetails("NA");
    };
    
});


function setBadgeDetails(batteryPercentage) {
    if(batteryPercentage <= 20) {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#f02424" });
        chrome.browserAction.setBadgeText({text: batteryPercentage + "%"});
    } else if(batteryPercentage > 20 && batteryPercentage <= 50) {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#cfa757" });
        chrome.browserAction.setBadgeText({text: batteryPercentage + "%"});
    } else if(batteryPercentage > 50 && batteryPercentage <= 80) {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#92b300" });
        chrome.browserAction.setBadgeText({text: batteryPercentage + "%"});
    } else if(batteryPercentage === "NA") {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#A9A9A9"});
        chrome.browserAction.setBadgeText({text: batteryPercentage});
    } else {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#00c728" });
        chrome.browserAction.setBadgeText({text: batteryPercentage + "%"});
    }
}