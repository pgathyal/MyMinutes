/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var bkPage = chrome.extension.getBackgroundPage();

/*
 * TODO: Programatically inject this script/funciton every time an entered url is 
            active. Look into on exit script to store remaining time
*/
    console.log("Reached Countdowntimer script for site " + site.url);
    var rTime = site.remainingTime;//in seconds for now
    var pUrl = site.url;
    var interval = setInterval(function(){            
        chrome.tabs.getSelected(null,function(tab){
            var tabUrl = bkPage.stringEncapsulate(tab.url);
            if(tabUrl[1]=== site.url){
                console.log("The website is now " + tab.url + " ..counting down");
                console.log("rTime = " + rTime);
                rTime--;
                if(rTime === 0){
                    //console.log("Remaining time = 0");
                    //Save to storage and call get_url()
                    console.log("CountdownTimer: rTime is 0, going to save and reset");
                    clearInterval(interval);
                } 
            }
            else{
                console.log("Site interrupt: website is now "  + tab.url + ". Save and reset");
                clearInterval(interval);
            }
        });
    },1000);
    console.log("Timer has finished with rTime = " + rTime);
        site.remainingTime = rTime;
    console.log("And Site Object remaining time = " + site.remainingTime);
        save_to_Storage(site);
    //document.getElementById("countdown").innerHTML = now;
    console.log("Finished Countdowntimer script for site " + site.url);


