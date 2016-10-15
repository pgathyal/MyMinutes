// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var selected_Url;
var bkPage = chrome.extension.getBackgroundPage();

function my_Notification(website){

    var notification = new Notification("My Minutes",{body: website + " unavailable"});
    notification.show = function(){ setTimeout(notification.close, 5000);};
}

function getUrl(callback){
    chrome.tabs.query({
        active:true,
        currentWindow:true
    },function (tabs){
        callback(tabs);
        });
}

function save_to_Storage(url){
    chrome.storage.sync.set({'myUrls':url}, function(){
        bkPage.get_Url();
        my_Notification(url);
    });
}

function clean_URL(url){
    var a = document.createElement('a');
    a.setAttribute('href',url);
    var hostname = a.hostname;
    
    //TODO: Remove commenting below, when ready to store to storage
    //save_to_Storage(hostname);
    
    return hostname;
}

function if_defined(url){
    if(url!==undefined)
        return clean_URL(url);
    else 
        return "No Page";
    
}

function getDomain(tabs){
        var url = tabs[0].url;
        //var domain = url.domain;
        document.getElementById("message").innerHTML = if_defined(url); 
}

function saveUrl(){  
        getUrl(getDomain);
}

window.onload=function(){
   // var button1 = document.getElementById("button1");
   // var url_button = document.getElementById("url_button");
   //button1.addEventListener("click", my_Notification);
    url_button.addEventListener("click", saveUrl);
}


