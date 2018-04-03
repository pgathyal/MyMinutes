
var rTime = "IDle";
var pUrl = "IDle";

//Get_url passes url to this parameter to block
var url_list = ["*://9gag.com/*"];
var activeTab = {
    url : null,
    remainingTime : null,
    startTime: null,
    endTime: null,
    present: false,
    orignalTime: null
};

var currentDate;

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
    chrome.storage.local.get({myWebsites: []}, function (data) {
        console.log(website);
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
                chrome.runtime.sendMessage({message:"Updating (message)",value:"Updating entry.."});
                saveArray_and_refresh(websites);
        }
        else if(present===false){
            //New website
            websites.push(website);
            saveArray_and_refresh(websites);
        }
        else{
            chrome.runtime.sendMessage({message:"Updating (message)",value:"Value already stored"});
        } 
    }); 
}
//Helper to the main save function
function saveArray_and_refresh(websites){
    chrome.storage.local.set({myWebsites: websites}, function(){
        chrome.runtime.sendMessage({message:"Updating (message)",value:"Stored Entry"});
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
                _getTabs();
                break;
        }
});

function clearStorage(){
    //console.log("Clearing storage...");
    chrome.storage.local.clear(function(){
        chrome.runtime.sendMessage({message: "Update (message)",value: "Clearing.."});
        var error = chrome.runtime.lastError;
        if(error){
            console.log(error);
        }
        url_list = ["*://9gag.com/*"];
        activeTab = {
            url : null,
            remainingTime : null,
            startTime: null,
            endTime: null,
            present: false,
            originalTime: null
        };
        updateListener();
    });
}

function updateListener(){
    //console.log("Updatinglistener function called, blocking array: " + url_list);
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



/*
 * Actively listen to active tabs
 *      -Find out if active means viewing 
 * Cross check with storage
 * If with storage - inject timer script
 * Script on exit - turn off timer...store value 
*/

//Called when creating and switching tabs
chrome.tabs.onActivated.addListener(
        function(){
           // console.log("OnActivated called..");
           _getTabs();
});

//Creating a newtab also triggers the onUpdated listener 
//along with the onActivated listener.
chrome.tabs.onUpdated.addListener(
        function(tabId,info){
            if(info.status === 'complete' && info.url !== 'newtab'){
                //console.log("onUpdated called");
               _getTabs();
           }
});

//Compares days, not months nor years.
window.onload = function(){
    today = new Date().getDate();
    
    chrome.storage.local.get("Date", function (data) {
        var storageDate = data.Date;
        console.log("Window onload accessing storage \n Date :" + storageDate);
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
    console.log("Accessing storage end");
    _pushToBlockingArray();
    
};

   
function saveDatetoStorage(date){
    chrome.storage.local.set({Date: date}, function(){
    }); 
}

function resetTime(){
    console.log("Resetting time");
    chrome.storage.local.get({myWebsites: []}, function(data){
            var websites = data.myWebsites;
            for(var i=0; i<websites.length; i++){
                websites[i].remainingTime = websites[i].originalTime;
                }
            saveArray_and_refresh(websites);
            });
}



// Window blur: stop timer, Window focus: call get tabs

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

//-----------------
//Website prototype
function Website(url, remainingTime, originalTime){
    this.url = url;
    this.remainingTime = remainingTime;
    this.originalTime = originalTime;
}
