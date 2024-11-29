// ==UserScript==
// @name         auto login for id.starbucks
// @namespace    http://tampermonkey.net/
// @version      2024-11-29
// @description  try to take over the world!
// @author       You
// @match        https://id.starbucks.com/*
// @icon         https://id.starbucks.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let user = ""
    let passwd = ""
    setInterval(()=>{
        let userNameInput = document.querySelector("#ContentPlaceHolder1_MFALoginControl1_UserIDView_txtUserid")
        let smsRadio = document.querySelector("#rbVoiceSMSPhone2_SMS")
        let passwdInput = document.querySelector("#ContentPlaceHolder1_MFALoginControl1_PasswordView_tbxPassword")
        if(userNameInput != null && userNameInput.value != null){
            userNameInput.value = user;
            document.querySelector("#ContentPlaceHolder1_MFALoginControl1_UserIDView_btnSubmit").click()
        }
        if(smsRadio!=null && smsRadio.checked == false){
            smsRadio.checked = true
            document.querySelector("#ContentPlaceHolder1_MFALoginControl1_RegistrationMethodView_tcButton input").click()
        }
        if(passwdInput!=null && passwdInput.value != null){
            passwdInput.value = passwd
            document.querySelector("#ContentPlaceHolder1_MFALoginControl1_PasswordView_btnSubmit").click()
        }
    },1000)
    // Your code here...
})();