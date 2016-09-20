// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.



function myFunction(){

    var notification = new Notification("Title",{body: "9gag Unavailable"});
    notification.show = function(){ setTimeout(notification.close, 5000);};
}

function getUrl(){
    chrome.tabs.query({
        active:true,
        currentWindow:true
    },function (tabs){
        var url = new URL(tabs[0].url);
        var domain = url.domain;
        document.getElementById("message").innerHTML = "Current page:" + domain;
        });
}

function getDomain(tabs){
    
    
    document.getElementById("message").innerHTML = "Current page:" + domain;
}

function saveUrl(){
  
     
        var domain = getUrl(getDomain);
        
        
    
}

window.onload=function(){
    var button1 = document.getElementById("button1");
    button1.addEventListener("click", myFunction);
    url_button.addEventListener("click", getUrl);
}


