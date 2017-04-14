/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var url_list = ["*://9gag.com/*","*://www.reddit.com/*"];


function get_Url(){
    chrome.storage.sync.get('myWebsites',function(data){
        console.log(data);
       //url_list.push(stringEncapsulate(data.myUrls));
       updateListener();
    });
}

function save_to_Storage(website){
    chrome.storage.sync.set({'myWebsites':website}, function(){
        get_Url();
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
    //go through url_list
        //if active
            //countdowntimer - using remainingTime
            //if remainingTime < 0 cancel:true
            //else cancel:false
        //else stop timer - new remainingTime
        //cancel:false
        console.log(details.url);
    return {cancel:true};
}


chrome.webRequest.onBeforeRequest.addListener(
        blockingListener,
        {urls: url_list},
        ["blocking"]
);

chrome.tabs.onActivated.addListener(
        function(){
          chrome.tabs.getSelected(null,function(tab){
              console.log(tab.url);
        }); 
});

//--------------------

