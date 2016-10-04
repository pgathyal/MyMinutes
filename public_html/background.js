/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var url_list = ["*://9gag.com/*"];



chrome.webRequest.onBeforeRequest.addListener(
        function() { 
            return {cancel: true};
        },
        {urls: url_list},
        ["blocking"]
);
  
