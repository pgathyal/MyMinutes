// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//var selected_Url = new Array();
var bkPage = chrome.extension.getBackgroundPage();



function my_Notification(website){
    var notification = new Notification("My Minutes",{body: website + " saved to storage"});
    setTimeout(function(){
        notification.close();},
        2000);
}

function clear_Storage(){
    chrome.storage.local.clear(function(){
        document.getElementById("message").innerHTML = "Clearing storage..";
        var error = chrome.runtime.lastError;
        if(error){
            console.log(error);
        }
        chrome.runtime.sendMessage({message: "Reset listener"});
    });
}

function clean_URL(url){
    //Creating an a element to extract hostname
    var results = bkPage.stringEncapsulate(url);
    
    my_Notification(results[0]);
    var time = document.getElementById("text_field").value;
    var website = new Website(results[1],parseInt(time));
    bkPage.save_to_Storage(website);
    
    return results[0];
}

function getDomain(tabs){
        var url = tabs[0].url;
        document.getElementById("message").innerHTML = if_defined(url); 
}

function if_defined(url){
    if(url!==undefined)
        return clean_URL(url);
    else 
        return "No Page";
    
}

function saveUrl(){
    var time = document.getElementById("text_field").value;
    //Validating textbox for int
    if(!isNaN(time)&&time.length>0){
        chrome.tabs.query({
        active:true,
        currentWindow:true
    },function (tabs){
        getDomain(tabs);
        });
    }
    else
       document.getElementById("message").innerHTML = "Invalid entry"; 
}

function updateFromStorage(){
    console.log("Reached updateTable");
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
    document.getElementById("url").innerHTML = bkPage.pUrl;
    document.getElementById("time").innerHTML = bkPage.rTime;
    document.getElementById("bmessage").innerHTML = bkPage.bMessage;
    
};

//-----------------
//Website prototype
function Website(url, remainingTime){
    this.url = url;
    this.remainingTime = remainingTime;
}



