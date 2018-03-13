// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//var selected_Url = new Array();
var bkPage = chrome.extension.getBackgroundPage();

chrome.runtime.onMessage.addListener(
        function(request,sender,sendResponse)
        {
            switch(request.message){
                case "Update (message)" :
                        document.getElementById("message").innerHTML = request.value;
                        break;
                case "Update (url)" :
                        document.getElementById("url").innerHTML = request.value;
                        break;
                case "Update (time)" :
                        document.getElementById("time").innerHTML = request.value;
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

function saveUrl(){
    var time = document.getElementById("text_field").value;
    //Validating textbox for int
    if(!isNaN(time)&&time.length>0){
        chrome.tabs.query({
        active:true,
        currentWindow:true
        },function (tabs){
            //Creating an a element to extract hostname
            var results = bkPage.stringEncapsulate(tabs[0].url);
            var time = document.getElementById("text_field").value;
            var website = new bkPage.Website(results[1],parseInt(time),parseInt(time));
            chrome.runtime.sendMessage({message: "Save to storage", value: website});
        });
    }
    else
       document.getElementById("message").innerHTML = "Invalid entry"; 
}

function updateFromStorage(){
    console.log("update from storage called");
    document.getElementById("message").innerHTML = "Updating..";
    console.log("updatefromstorage called");
    var table = document.getElementById("table");
    while(table.rows.length > 1){
        table.deleteRow(1);
    }
    chrome.storage.local.get({myWebsites: []}, function (data) {
        var websites = data.myWebsites;
        for(var i=0; i<websites.length; i++){
            if(!document.getElementById) return;
            //var table = document.getElementById("table");
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            var cell2 = document.createElement("td");
            textNode1 = document.createTextNode(websites[i].url);
            textNode2 = document.createTextNode(websites[i].remainingTime);
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





