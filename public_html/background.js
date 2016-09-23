/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//Todo: receive variable array list from popup
var url_list;

chrome.webRequest.onBeforeRequest.addListener(
        function() { 
            return {cancel: true};
        },
        {urls: url_list},
        ["blocking"]
);
  
