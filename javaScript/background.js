
var rTime = "IDle";
var pUrl = "IDle";

//Get_url passes url to this parameter to block
var url_list = ["*://9gag.com/*"];
/*var activeTab = {
    url : null,
    remainingTime : null,
    startTime: null,
    endTime: null,
    present: false,
    orignalTime: null
};

var currentDate;
*/
/*Wrapping string function -
        returns 2 values : [0]hostname,[1]wrapped hostname
*/
function stringEncapsulate(url){
    var a = document.createElement('a');
    a.setAttribute('href',url);
    var hostname = a.hostname;
    return [hostname,"*://" + hostname + "/*"];
}

//------------------------------------------------------------------------------
//Main save function
function save_to_Storage(website){
    //console.log("Saving to storage:" + website.url + ", " + convertToTimeformat(website.remainingTime));
    chrome.storage.local.get({myWebsites: []}, function (data) {
        var websites = data.myWebsites;
        var present = false;
        var timeLessthan = -1;
        for(var i=0; i<websites.length; i++){
            if(websites[i].url === website.url){
                if(websites[i].remainingTime > website.remainingTime){
                    timeLessthan = i;
                    break;
                }
                present = true;
                break;
            }
        }
        if(timeLessthan >= 0){
            //Replace old with new
            websites[timeLessthan] = website;
            saveArray_and_refresh(websites);
        }
        else if(present===false){
            //New website
            websites.push(website);
            saveArray_and_refresh(websites);
            _getTabs();
        }
        else{
            console.log("SAVE STORAGE FUNC: Value already stored");
        } 
    }); 
}
//Helper to the main save function
function saveArray_and_refresh(websites){
    chrome.storage.local.set({myWebsites: websites}, function(){
        _pushToBlockingArray();
    }); 
}

function _pushToBlockingArray(){
    chrome.storage.local.get({myWebsites: []}, function(data){
                    var websites = data.myWebsites;
                    url_list = ["*://9gag.com/*"];
                    for(var i=0; i<websites.length; i++){
                            if(websites[i].remainingTime <= 0){
                                url_list.push(websites[i].url);
                            }
                        }
                        updateListener();
                    });
}

function getRemainingTime(url, sendResponse){
    chrome.storage.local.get({myWebsites: []}, function(data){
                    var websites = data.myWebsites;
                    for(var i=0; i<websites.length; i++){
                            if(websites[i].url === url){
                                sendResponse({value: websites[i].remainingTime});
                            }
                        }
                    });
}

function convertToTimeformat(milliseconds){
    var hour = (Math.floor(milliseconds/3600000)).toString();
    var minute = (Math.floor((milliseconds%3600000)/60000)).toString();
    if(minute<10)
        minute = "0" + minute;
    return result = hour.concat(":",minute);
}

//------------------------------------------------------------------------------
//Listener to get messages
chrome.runtime.onMessage.addListener(
        function(request,sender,sendResponse)
        {
            switch(request.message){
            case "Reset listener" :
                clearStorage();
                break;
            case "Save to storage" :
                save_to_Storage(request.value);
                break;
            case "Get remaining time" :
                getRemainingTime(request.value, sendResponse);
                return true;
            case "Create and Save to storage" :
                var new_website = new Website(request.url, request.remainingTime, request.originalTime);
                save_to_Storage(new_website);
                break;
            case "Debug" :
                //console.log("Anchor clicked");
        }
});

function clearStorage(){
    //console.log("Clearing storage...");
    chrome.storage.local.remove(["myWebsites"],function(){
        var error = chrome.runtime.lastError;
        if(error){
            console.log(error);
        }
        url_list = ["*://9gag.com/*"];
        updateListener();
    });
}

function updateListener(){
    if(chrome.webRequest.onBeforeRequest.hasListener(blockingListener))
    {
        chrome.webRequest.onBeforeRequest.removeListener(blockingListener);
        chrome.webRequest.onBeforeRequest.addListener(blockingListener,
                        {urls:url_list},
                        ["blocking"]
        );
    }
}

function blockingListener(details){
    return {cancel:true};
}


chrome.webRequest.onBeforeRequest.addListener(
        blockingListener,
        {urls : url_list},
        ["blocking"]
);


//Creating a newtab also triggers the onUpdated listener 
chrome.tabs.onUpdated.addListener(
        function(tabId,info){
            if(info.status === 'complete'){
               _getTabs();
           }
});

//Compares days, not months nor years.
window.onload = function(){
    today = new Date().getDate();
    chrome.storage.local.get("Date", function (data) {
        var storageDate = data.Date;
        if(storageDate === today){
            
        }
        else if(storageDate === undefined){
            saveDatetoStorage(today);
        }
        else{
            resetTime();
            saveDatetoStorage(today);
        }
        
    });
    _pushToBlockingArray();
    
};

   
function saveDatetoStorage(date){
    chrome.storage.local.set({Date: date}, function(){
    }); 
}

function resetTime(){
    chrome.storage.local.get({myWebsites: []}, function(data){
            var websites = data.myWebsites;
            for(var i=0; i<websites.length; i++){
                websites[i].remainingTime = websites[i].originalTime;
                }
            saveArray_and_refresh(websites);
            });
}

/*
 *  Alternate solutions: Pass ongoing urls to a list, pass list to manifest content scripts
 *                          Call execute script on tab first time only
 *  Find out if script is always running even if webpage is closed (reopen and test timer stats)
 *  Fall back to previous state
 */


function _getTabs(){
    chrome.tabs.query({active:true,
                       lastFocusedWindow:true
                       },function(tab){
        chrome.storage.local.get({myWebsites: []}, function(data){
            var websites = data.myWebsites;
            var active_url = stringEncapsulate(tab[0].url);
            //console.log(active_url + " currently viewed");
            for(var i=0; i<websites.length; i++){
                if(active_url[1] === websites[i].url && websites[i].remainingTime !== 0){
                    chrome.tabs.executeScript(null,{
                      code: 'var website = ' + JSON.stringify(websites[i])
                    },function(){
                            chrome.tabs.executeScript(null, {file: "jquery-3.3.1.js" },function(){
                                chrome.tabs.executeScript(null, {file: "javaScript/blurHandler.js" });
                            });
                    });
                }
            }
        });
    });
}
/*
function _getTabs(){
    console.log("getTabs called");
    chrome.tabs.query({active:true,
                       lastFocusedWindow:true
                       },function(tab){
        activeTab.endTime = new Date().getTime();
        if(activeTab.present === true){
            console.log("Ending timer with " + activeTab.url[0] + ", saving to storage..");
            var website = new Website(activeTab.url[1],Math.max(0,activeTab.remainingTime - (activeTab.endTime - activeTab.startTime)),activeTab.originalTime);
            save_to_Storage(website);
        }
        chrome.storage.local.get({myWebsites: []}, function(data){
            var websites = data.myWebsites;
            activeTab.url = stringEncapsulate(tab[0].url);
            activeTab.endTime = null;
            //console.log(activeTab.url[0] + " currently viewed");
            for(var i=0; i<websites.length; i++){
                if(activeTab.url[1] === websites[i].url && websites[i].remainingTime !== 0){
                    activeTab.startTime =  new Date().getTime();
                    activeTab.remainingTime = websites[i].remainingTime;
                    activeTab.present = true;
                    activeTab.originalTime = websites[i].originalTime;
                    console.log("Started timer with " + activeTab.url[0]);
                    chrome.tabs.executeScript(null,{
                        file: "javaScript/blurHandler.js"
                    });
                    break;
                }
                else
                    activeTab.present = false;
            }
        });
    });
}
*/
//-----------------
//Website prototype
function Website(url, remainingTime, originalTime){
    this.url = url;
    this.remainingTime = remainingTime;
    this.originalTime = originalTime;
}
