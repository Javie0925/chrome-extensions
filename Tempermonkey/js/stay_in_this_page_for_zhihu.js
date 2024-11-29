// ==UserScript==
// @name         stay in this page for zhihu
// @namespace    http://tampermonkey.net/
// @version      2024-11-28
// @description  try to take over the world!
// @author       You
// @match        https://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //alert(window.location.href);
    let allA = document.querySelectorAll(".AnswerItem .ContentItem-title a")
    let allA2 = document.querySelectorAll(".HotItem .HotItem-content a")
    setInterval(function(){
        let allA = document.querySelectorAll(".AnswerItem .ContentItem-title a")
        let allA2 = document.querySelectorAll(".HotItem .HotItem-content a")
        replaceA(allA);
        replaceA(allA2);
    },1000)
})();

function replaceA(allA){
    if(null == allA || allA.length ==0) return
    allA.forEach((item,index)=>{
        let a = item;
        let parent = a.parentElement;
        let b = document.createElement("b")
        //let text = document.createTextNode(a.innerText)
        b.innerHTML = a.innerHTML
        //parent.appendChild(b)
        parent.replaceChild(b, a);
        b.onclick=function(){
            window.location.href = a.href;
        }
    })
}