chrome.runtime.onInstalled.addListener(() => {
    // offscreen
    chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['CLIPBOARD'],
        justification: 'reason for needing the document',
    });
    // create menu
    chrome.contextMenus.create({
        type: 'normal',
        title: 'JV DICT: Search "%s"',
        id: 'selection',
        // all, audio, action, editable, frame, image, launcher, link, page, page_action, selection, video.
        contexts: ['selection'],
    });
    // automatic clipboard pasting switch
    chrome.contextMenus.create({
        title: "TURN ON automatic clipboard pasting",
        id: "automatic-clipboard-pasting-on",
        contexts: ["action"]
    }, () => {
        console.log("callback")
    });
    chrome.contextMenus.create({
        "title": "TURN OFF automatic clipboard pasting",
        "id": "automatic-clipboard-pasting-off",
        "contexts": ["action"],
    });
    // dict
    chrome.contextMenus.create({
        "title": "Select dictionary",
        "id": "dict",
        "contexts": ["action"]
    });
    chrome.contextMenus.create({
        "title": "Youdao",
        "parentId": "dict",
        "id": "youdao-dict",
        "contexts": ["action"],
    });
    chrome.contextMenus.create({
        "title": "Bing",
        "parentId": "dict",
        "id": "bing-dict",
        "contexts": ["action"],
    });
    // translator
    chrome.contextMenus.create({
        "title": "Select translator",
        "id": "trans",
        "contexts": ["action"]
    });
    chrome.contextMenus.create({
        "title": "Baidu",
        "parentId": "trans",
        "id": "baidu-trans",
        "contexts": ["action"],
    });
    chrome.contextMenus.create({
        "title": "Google",
        "parentId": "trans",
        "id": "google-trans",
        "contexts": ["action"],
    });
    chrome.contextMenus.onClicked.addListener((item, tab) => {
        switch (item.menuItemId) {
            case "selection":
                let text = item.selectionText.trim()
                chrome.storage.local.get(["AUTOMATIC_CLIPBOARD_PASTING", "ACTIVATED_DICT", "ACTIVATED_TRANS"], (kv) => {
                    chrome.runtime.sendMessage({
                        target: 'offscreen',
                        text,
                        urlMap: kv,
                        chrome: chrome
                    });
                    store(text)
                })
                break;
            case "automatic-clipboard-pasting-on":
                chrome.storage.local.set({"AUTOMATIC_CLIPBOARD_PASTING": true})
                break;
            case "automatic-clipboard-pasting-off":
                chrome.storage.local.set({"AUTOMATIC_CLIPBOARD_PASTING": false})
                break;
            case "youdao-dict":
                chrome.storage.local.set({"ACTIVATED_DICT": "https://dict.youdao.com/result?lang=en&word="})
                break;
            case "bing-dict":
                chrome.storage.local.set({"ACTIVATED_DICT": "https://cn.bing.com/dict/search?q="})
                break;
            case "baidu-trans":
                chrome.storage.local.set({"ACTIVATED_TRANS": "https://fanyi.baidu.com/#zh/en/"})
                break;
            case "google-trans":
                chrome.storage.local.set({"ACTIVATED_TRANS": "https://translate.google.com/?sl=auto&tl=zh-CN&op=translate&text="})
                break;
            default:
        }
    });
})

function store(text) {
    if (text instanceof String) {
        text = text.trim()
    } else {
        text = '' + text
    }
    chrome.storage.local.get("SEARCH_HISTORY", function (kv) {
        let arr = kv["SEARCH_HISTORY"]
        if (!arr || !(arr instanceof Array)) arr = []
        arr = arr.filter(w => w !== text)
        arr = [text, ...arr]
        chrome.storage.local.set({"SEARCH_HISTORY": arr}, function () {
            console.log('set history success')
        })
    })
}
