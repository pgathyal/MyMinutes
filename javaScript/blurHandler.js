
var startTime = new Date().getTime();
var remainingTime = website.remainingTime;
var originalTime = website.originalTime;

var timeOut = setTimeout(function(){save_to_Storage(); startTime = null;}, 900000);
chrome.runtime.sendMessage({message: "Special blur"});


window.addEventListener("blur",function(){
    clearTimeout(timeOut);
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
    timeOut = setTimeout(function(){save_to_Storage(); startTime = null;}, 20000);
});

window.addEventListener("beforeunload",function(){
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



