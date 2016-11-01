/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var url_list = ["*://9gag.com/*"];

function stringEncapsulate(url){
    return ("*://" + url + "/*");
}

function get_Url(){
    chrome.storage.sync.get('myWebsites',function(data){
        console.log(data);
       //url_list.push(stringEncapsulate(data.myUrls));
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

function blockingListener(){
    return {cancel:true};
}


chrome.webRequest.onBeforeRequest.addListener(
        blockingListener,
        {urls: url_list},
        ["blocking"]
);
  
