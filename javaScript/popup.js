// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var selected_Url;
var bkPage = chrome.extension.getBackgroundPage();

function stringEncapsulate(url){
    return ("*://" + url + "/*");
}

function my_Notification(website){
    var notification = new Notification("My Minutes",{body: website + " saved to storage, now unavailable"});
    setTimeout(function(){
        notification.close();},
        2000);
}

function save_to_Storage(website){
    chrome.storage.sync.set({'myWebsites':website}, function(){
        //Send message to background page
        chrome.runtime.sendMessage({message: "Storing Data"});
    });
}

function clean_URL(url){
    //Creating an a element to extract hostname
    var a = document.createElement('a');
    a.setAttribute('href',url);
    var hostname = a.hostname;
    
    my_Notification(hostname);
    var time = document.getElementById("text_field").value;
    var website = new Website(stringEncapsulate(hostname),parseInt(time));
    save_to_Storage(website);
    
    return hostname;
}

//------------------------------------
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
//-----------------------------------

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

window.onload = function(){
    url_button.addEventListener("click", saveUrl);
};

//-----------------
//Website prototype
function Website(url, remainingTime){
    this.url = url;
    this.remainingTime = remainingTime;
}



