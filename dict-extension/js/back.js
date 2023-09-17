function backjs() {
    let cb = (msg) => alert(msg)
    chrome.tabs.getSelected(null, function (tab) {
        var title = tab.title
        try {
            //cb(tab.id)
            chrome.tabs.executeScript(null, {
                code: ``
            })
        } catch (e) {
            cb(e)
        }
    })
}
// bing
chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        type: 'normal',
        title: 'JV Bing Dict',
        id: 'bing',
        // all, audio, browser_action, editable, frame, image, launcher, link, page, page_action, selection, video.
        contexts: ['selection'],
    });
});
// youdao
// chrome.runtime.onInstalled.addListener(async () => {
//     chrome.contextMenus.create({
//         type: 'normal',
//         title: 'YouDao Dict',
//         id: 'youdao',
//         contexts: ['all'],
//     });
// });
const global = (function () {
    if (!this) throw "Don't add 'use strict' globally, use it inside IIFE/functions";
    return this;
})();


chrome.contextMenus.onClicked.addListener((item, tab) => {
    let tabId = item.menuItemId
    let text = item.selectionText
    let url = null
    if (text.split(" ").length > 1 || isChinese(text)) {
        url = `https://cn.bing.com/search?q=翻译：${text}`;
    } else {
        url = `https://cn.bing.com/dict/search?q=${text}`;
    }
    //chrome.tabs.create({ url: url.href, index: (tab && tab.index) ? tab.index+100 : 0 });
    window.open(url);
});

function isChinese(text) {
    var patrn = /[\u4e00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (!patrn.exec(text)) {
        return false;
    } else {
        return true;
    } 

}
