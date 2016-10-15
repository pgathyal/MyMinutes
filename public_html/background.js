/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//TODO: Test for dynamic increase in url_list

var url_list = ["*://9gag.com/*"];

function stringEncapsulate(url){
    return ("*://" + url + "/*");
}

function get_Url(){
    chrome.storage.sync.get('myUrls',function(data){
       url_list.push(stringEncapsulate(data.myUrls));
    });
}

//TODO: Implement storage Onchange listener - renew webRequest listener with new url_list

//TODO: Implement update listener

chrome.webRequest.onBeforeRequest.addListener(
        function() { 
            return {cancel: true};
        },
        {urls: url_list},
        ["blocking"]
);
  
