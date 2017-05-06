/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var url_list = ["*://9gag.com/*"];
//var port = chrome.runtime.connect({name:"mycontentscript"});

function get_Url(){
    chrome.storage.local.get({myWebsites: []}, function(data){
        console.log("Reached background-getURL..");
         var websites = data.myWebsites;
             for(var i=0; i<websites.length; i++){
                url_list.push(websites[i].url);
             }
        
        console.log("After push - " + url_list);
        console.log(url_list);
       
        updateListener();
    });
}


function getStorage_bkg(){
    chrome.storage.local.get(function(result){console.log(result);});
}
//Listener to get message to start get_Url
chrome.runtime.onMessage.addListener(
        function(request,sender,sendResponse)
        {
            console.log("Reached background listener");
            switch(request.message){
            case "Storing Data" : 
                console.log("Passed message check..accessing storage");
                get_Url();
                sendResponse({result: "Succesfully stored"});
                break;
            case "Update listener" :
                url_list = ["*://9gag.com/*"];
                updateListener();
            }
        }
);

chrome.runtime.onConnect.addListener(function(port){
    port.postMessage({greeting:"hello"});
});



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
    //go through url_list
        //if active
            //countdowntimer - using remainingTime
            //if remainingTime < 0 cancel:true
            //else cancel:false
        //else stop timer - new remainingTime
        //cancel:false
    return {cancel:true};
}


chrome.webRequest.onBeforeRequest.addListener(
        blockingListener,
        {urls: url_list},
        ["blocking"]
);

/*
chrome.tabs.onActivated.addListener(
        function(){
          chrome.tabs.getSelected(null,function(tab){
              //console.log(tab.url);
        }); 
});
*/
//--------------------

