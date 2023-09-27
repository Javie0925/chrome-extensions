function isChinese(text) {
    var patrn = /[\u4e00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (!patrn.exec(text)) {
        return false;
    } else {
        return true;
    }
}


function doSearch(text, urlMap) {
    if (!text) return
    text = text.trim()
    let url
    if (text.split(" ").length > 1 || isChinese(text)) {
        if (chrome && chrome.storage) {
            chrome.storage.local.get("ACTIVATED_TRANS", function (kv) {
                url = kv["ACTIVATED_TRANS"] || `https://fanyi.baidu.com/#zh/en/`;
                url = url.concat(text)
                recordAndOpen(text, url);
            })
        } else {
            url = urlMap["ACTIVATED_TRANS"] || `https://fanyi.baidu.com/#zh/en/`;
            url = url.concat(text)
            recordAndOpen(text, url);
        }
    } else {
        if (chrome && chrome.storage) {
            chrome.storage.local.get("ACTIVATED_DICT", function (kv) {
                url = kv["ACTIVATED_DICT"] || `https://cn.bing.com/dict/search?q=`;
                url = url.concat(text)
                recordAndOpen(text, url);
            })
        } else {
            url = urlMap["ACTIVATED_DICT"] || `https://cn.bing.com/dict/search?q=`;
            url = url.concat(text)
            recordAndOpen(text, url);
        }
    }
    //chrome.tabs.create({ url: url.href, index: (tab && tab.index) ? tab.index+100 : 0 });
}


async function recordAndOpen(text, url) {
    store(text);
    window.open(url);
}

function store(text) {
    if (chrome && chrome.storage) {
        if (text instanceof String) {
            text = text.trim()
        } else {
            text = '' + text
        }
        chrome.storage.local.get("SEARCH_HISTORY", function (kv) {
            let arr = kv[SEARCH_HISTORY]
            if (!arr || !(arr instanceof Array)) arr = []
            arr = arr.filter(w => w !== text)
            arr = [text, ...arr]
            chrome.storage.local.set({"SEARCH_HISTORY": arr}, function () {
                console.log('set history success')
            })
        })
    }
}
