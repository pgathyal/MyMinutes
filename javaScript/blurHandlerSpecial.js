
var startTime = new Date().getTime();
var remainingTime = website.remainingTime;
var originalTime = website.originalTime;
chrome.runtime.sendMessage({message: "Special focus", value: website.url});

window.addEventListener("blur",function(){
    chrome.runtime.sendMessage({message: "Special blur"});
    save_to_Storage();
    startTime = null;
});

window.addEventListener("focus",function(){
    chrome.runtime.sendMessage({message: "Special focus", value: website.url});
    
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
});

window.addEventListener("beforeunload",function(){
    chrome.runtime.sendMessage({message: "Special blur"});
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



