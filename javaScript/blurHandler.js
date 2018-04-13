/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//Start timer here
var startTime = new Date().getTime();
var remainingTime = website.remainingTime;
var originalTime = website.originalTime;
//var timeOut = setTimeout(function(){alert("15 mins have finished..");}, 900000);


window.addEventListener("blur",function(){
    //clearTimeout(timeOut);
    save_to_Storage();
    startTime = null;
});

window.addEventListener("focus",function(){
    startTime = new Date().getTime();
    chrome.storage.local.get({myWebsites: []}, function(data){
                    var websites = data.myWebsites;
                    for(var i=0; i<websites.length; i++){
                            if(websites[i].url === website.url){
                                remainingTime = websites[i].remainingTime;
                                break;
                            }
                        }
                    });
   // timeOut = setTimeout(function(){prompt("Still there?");}, 10000);
});

$("a").click(function(){
    if(website.url === "*://www.youtube.com/*")
        chrome.runtime.sendMessage({
            message:"Create and Save to storage",
            url: website.url,
            remainingTime: Math.max(0,remainingTime - (new Date().getTime() - startTime)),
            originalTime: website.originalTime
        });
});

//Doesn't account for unloading youtube
window.addEventListener("beforeunload",function(){
    //chrome.runtime.sendMessage({message: "Debug"});
    save_to_Storage();
});

function save_to_Storage(){
    if(startTime !== null){
        var endTime = new Date().getTime();
        chrome.runtime.sendMessage({
            message:"Create and Save to storage",
            url: website.url,
            remainingTime: Math.max(0,remainingTime - (endTime - startTime)),
            originalTime: website.originalTime
        });
    }
}



