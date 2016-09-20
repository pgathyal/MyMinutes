/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

chrome.webRequest.onBeforeRequest.addListener(
        function() { 
            return {cancel: true};
        },
        {urls: ["*://9gag.com/*"]},
        ["blocking"]
);
  
