
var rTime = "IDle";
var pUrl = "IDle";
var bMessage = "IDle";

//Get_url passes url to this parameter to block
var url_list = ["*://9gag.com/*"];

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
        var websites = data.myWebsites;
        var present = false;
        var timeLessthan = -1;
        for(var i=0; i<websites.length; i++){
            if(websites[i].url === website.url){
                if(websites[i].remainingTime > website.remainingTime){
                    console.log("Hit inner if-statement, new rT is lower");
                    timeLessthan = i;
                    break;
                }
                console.log("Hit outer if-statement, url already present, new rt is higher ");
                present = true;
                break;
            }
        }
        if(timeLessthan >= 0){
            //Replace old with new
            websites[timeLessthan] = website;
            saveArray_and_refresh(websites);
            bMessage = "Background: Updated entry";
        }
        else if(present===false){
            websites.push(website);
            saveArray_and_refresh(websites);
        }
        else{
            bMessage = "Background: Url already in storage";
        }      
    }); 
}
//Helper to the main save function
function saveArray_and_refresh(websites){
    chrome.storage.local.set({myWebsites: websites}, function(){
        bMessage = "Background: Stored Data";
        get_Url();
    }); 
}

//Helper to main save function
function get_Url(){
    
    url_list = ["*://9gag.com/*"];
    chrome.storage.local.get({myWebsites: []}, function(data){
         var websites = data.myWebsites;
             for(var i=0; i<websites.length; i++){
                //if(websites[i].remainingTime === 0)
                url_list.push(websites[i].url);
             }
        
        console.log("After push - ");
        console.log(url_list);
       
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
                url_list = ["*://9gag.com/*"];
                updateListener();
            }
        }
);

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
        {urls: url_list},
        ["blocking"]
);

/*
 * Actively listen to active tabs
 *      -Find out if active means viewing 
 * Cross check with storage
 * If with storage - inject timer script
 * Script on exit - turn off timer...store value 
*/
chrome.tabs.onActivated.addListener(
        function(){
            chrome.tabs.getSelected(null,function(tab){
                chrome.storage.local.get({myWebsites: []}, function(data){
                    var websites = data.myWebsites;
                    for(var i=0; i<websites.length; i++){
                        var storageSite = stringEncapsulate(tab.url);
                        if(storageSite[1] === websites[i].url){
                            countdowntimer(websites[i]);
                        }
                         //console.log("matches with " + websites[i].url);
                    }
                 
                });
            }); 
});

window.onload = get_Url();

/*
 * TODO: Programatically inject this script/funciton every time an entered url is 
            active. Look into on exit script to store remaining time
*/
function countdowntimer(site){
    
    /*rTime = site.remainingTime;//in seconds for now
    pUrl = site.url;
    var interval = setInterval(function(){
        rTime--;
        site.remainingTime = rTime;
        if(site.remainingTime === 0){
            //console.log("Remaining time = 0");
            get_Url();
            rTime = "IDLE";
            pUrl = "IDLE";
            clearInterval(interval);
        } 
    },1000);
    //document.getElementById("countdown").innerHTML = now;
    */
   console.log("Reached Countdowntimer func");
   if(window.focus()){
       alert(site.url + " is focused");
   }
}

//May need to call get_Url for every reload of the extension
