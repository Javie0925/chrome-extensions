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

// create menu
chrome.contextMenus.create({
    type: 'normal',
    title: 'JV DICT: Search "%s"',
    id: 'bing',
    // all, audio, browser_action, editable, frame, image, launcher, link, page, page_action, selection, video.
    contexts: ['selection'],
});
// automatic clipboard pasting switch
chrome.contextMenus.create({
    "title": "TURN ON automatic clipboard pasting",
    "id": "automatic-clipboard-pasting-on",
    "contexts": ["browser_action"],
    "onclick": function () {
        chrome.storage.local.set({"AUTOMATIC_CLIPBOARD_PASTING": true})
    }
});
chrome.contextMenus.create({
    "title": "TURN OFF automatic clipboard pasting",
    "id": "automatic-clipboard-pasting-off",
    "contexts": ["browser_action"],
    "onclick": function () {
        chrome.storage.local.set({"AUTOMATIC_CLIPBOARD_PASTING": false})
    }
});
// dict
chrome.contextMenus.create({
    "title": "Select dictionary",
    "id": "dict",
    "contexts": ["browser_action"]
});
chrome.contextMenus.create({
    "title": "Youdao",
    "parentId": "dict",
    "id": "youdao-dict",
    "contexts": ["browser_action"],
    "onclick": function () {
        chrome.storage.local.set({"ACTIVATED_DICT": "https://dict.youdao.com/result?lang=en&word="})
    }
});
chrome.contextMenus.create({
    "title": "Bing",
    "parentId": "dict",
    "id": "bing-dict",
    "contexts": ["browser_action"],
    "onclick": function () {
        chrome.storage.local.set({"ACTIVATED_DICT": "https://cn.bing.com/dict/search?q="})
    }
});
// translator
chrome.contextMenus.create({
    "title": "Select translator",
    "id": "trans",
    "contexts": ["browser_action"]
});
chrome.contextMenus.create({
    "title": "Baidu",
    "parentId": "trans",
    "id": "baidu",
    "contexts": ["browser_action"],
    "onclick": function () {
        chrome.storage.local.set({"ACTIVATED_TRANS": "https://fanyi.baidu.com/#zh/en/"})
    }
});
chrome.contextMenus.create({
    "title": "Google",
    "parentId": "trans",
    "id": "google",
    "contexts": ["browser_action"],
    "onclick": function () {
        chrome.storage.local.set({"ACTIVATED_TRANS": "https://translate.google.com/?sl=auto&tl=zh-CN&op=translate&text="})
    }
});


chrome.contextMenus.onClicked.addListener((item, tab) => {
    let text = item.selectionText.trim()
    doSearch(text)
});
