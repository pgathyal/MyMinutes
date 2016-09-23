// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var selected_Url;
var url_List;

function my_Notification(website){

    var notification = new Notification("Title",{body: website + " Unavailable"});
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

function clean_URL(url){
    var a = document.createElement('a');
    a.setAttribute('href',url);
    return a.hostname;
}

function getDomain(tabs){
    
        var url = tabs[0].url;
        //var domain = url.domain;
        if(url!=undefined){
            selected_URL = clean_URL(url);
            url_List.push(selectedURL);
            my_Notification(clean_URL(url));
        }
        else{
           document.getElementById("message").innerHTML = "No page"; 
        }
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


