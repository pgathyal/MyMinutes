// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var bkPage = chrome.extension.getBackgroundPage();

chrome.runtime.onMessage.addListener(
        function(request,sender,sendResponse)
        {
            switch(request.message){
                case "Update (message)" :
                        document.getElementById("message").innerHTML = request.value;
                        break;
                case "Update (table)" :
                        updateFromStorage();
                        break;    
            }
        }
);
function clear_Storage(){
        chrome.runtime.sendMessage({message: "Reset listener"});
}

function convertToMilliseconds(hours,minutes){
        var result = hours*3600000 + minutes*60000;
        console.log(result);
        return result;
}

function convertToTimeformat(milliseconds){
    var hour = (Math.floor(milliseconds/3600000)).toString();
    var minute = (Math.floor((milliseconds%3600000)/60000)).toString();
    var second = (Math.floor((milliseconds%60000)/1000)).toString();
    if(minute<10)
        minute = "0" + minute;
    if(second<10)
        second = "0" + second;
    return result = hour.concat(":",minute,":",second);
}

function saveUrl(){
    var hours = document.getElementById("text_hour").value;
    var minutes = document.getElementById("text_minute").value;
    var time = convertToMilliseconds(hours,minutes);
    //Validating textbox for int
    if(!isNaN(time)&&time>0){
        chrome.tabs.query({
        active:true,
        currentWindow:true
        },function (tabs){
            //Creating an a element to extract hostname
            var results = bkPage.stringEncapsulate(tabs[0].url);
            var website = new bkPage.Website(results[1],parseInt(time),parseInt(time));
            chrome.runtime.sendMessage({message: "Save to storage", value: website});
        });
    }
    else
        alert("Invalid entry");
       
}

function updateFromStorage(){
    var table = document.getElementById("table");
    while(table.rows.length > 1){
        table.deleteRow(1);
    }
    chrome.storage.local.get({myWebsites: []}, function (data) {
        var websites = data.myWebsites;
        for(var i=0; i<websites.length; i++){
            if(!document.getElementById) return;
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            var cell2 = document.createElement("td");
            textNode1 = document.createTextNode(websites[i].url.slice(4,websites[i].url.length - 2));
            textNode2 = document.createTextNode(convertToTimeformat(websites[i].remainingTime));
            cell1.appendChild(textNode1);
            cell2.appendChild(textNode2);
            row.appendChild(cell1);
            row.appendChild(cell2);
            table.appendChild(row);
        }
    });
}

window.onload = function(){
    url_button.addEventListener("click", saveUrl);
    clear_storage.addEventListener("click", clear_Storage);
    update.addEventListener('click',updateFromStorage);
    updateFromStorage();
};





