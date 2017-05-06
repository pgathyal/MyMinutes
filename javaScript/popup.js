// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//var selected_Url = new Array();
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

function clear_Storage(){
    chrome.storage.local.clear(function(){
        document.getElementById("message").innerHTML = "Clearing storage..";
        var error = chrome.runtime.lastError;
        if(error){
            console.log(error);
        }
        chrome.runtime.sendMessage({message: "Update listener"});
    });
}
//----------------------------------------
function save_to_Storage(website){
    chrome.storage.local.get({myWebsites: []}, function (result) {
        var Websites = result.myWebsites;
        Websites.push(website);
        chrome.storage.local.set({myWebsites: Websites}, function(){
                console.log("Sending message");
                chrome.runtime.sendMessage({message: "Storing Data"},function(response){
                    document.getElementById("message").innerHTML = "Response from background :" + response.result;
                });
        });      
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

function getStorage_popup(){
    chrome.storage.local.get(function(result){console.log(result);});
}



window.onload = function(){
    url_button.addEventListener("click", saveUrl);
    get_storage.addEventListener("click", getStorage_popup);
    get_bstorage.addEventListener("click", bkPage.getStorage_bkg);
    clear_storage.addEventListener("click", clear_Storage);
};

//-----------------
//Website prototype
function Website(url, remainingTime){
    this.url = url;
    this.remainingTime = remainingTime;
}



