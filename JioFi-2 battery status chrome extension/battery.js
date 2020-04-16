let domParser = new window.DOMParser();

var temp = 0;

const batteryXMLAPI = "http://jiofi.local.html/mark_title.w.xml";

function refreshBatteryPercentage() {  
    var refreshId = setInterval(function() {
        fetch(batteryXMLAPI)
        .then(resp => resp.text())
        .then(xmlResp => domParser.parseFromString(xmlResp, "text/xml"))
        .then(data => {
            let batteryPercentage = data.getElementsByTagName("batt_per")[0].childNodes[0].nodeValue;
            // let batteryPercentage = 15; // debugging
            if(batteryPercentage != temp) {
                setBatteryStatusColor(batteryPercentage);
                chrome.browserAction.setBadgeText({text: batteryPercentage + "%"});
                temp = batteryPercentage;
                // console.log("temp change: " + temp)
            }
        })
        .catch(err => {
            chrome.browserAction.setBadgeBackgroundColor({ color: "#A9A9A9"});
            chrome.browserAction.setBadgeText({text: "NA"});
            clearInterval(refreshId);
        });
        // console.log("batteryPercentage: " + batteryPercentage);
    }, 2000);
}


// wake up extension on clicking its icon after wifi change or when no wifi network is connected or after conecting to JioFi
chrome.browserAction.onClicked.addListener(() => refreshBatteryPercentage());

function setBatteryStatusColor(batteryPercentage) {
    if(batteryPercentage <= 20) {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#f02424" });
    } else if(batteryPercentage > 20 && batteryPercentage <= 50) {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#cfa757" });
    } else if(batteryPercentage > 50 && batteryPercentage <= 80) {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#92b300" });
    } else {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#00c728" });
    }
}