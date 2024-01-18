const KEY = "STAY_ON_THIS_PAGE_ACTIVE_LIST"

chrome.tabs.onCreated.addListener(function (tab) {
    removeTarget(tab)
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    removeTarget(tab)
});


function removeTarget(tab) {
    chrome.storage.local.get([KEY], (kv) => {
        let targetHost = getTargetHost(tab.url)
        if (kv[KEY] === null || kv[KEY] === undefined || !kv[KEY] instanceof Array) kv[KEY] = []
        let found = kv[KEY].find(item => item === targetHost)
        if (found) { // if current url is in the active list
            // execute callback function to remove target
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: function () {
                    document.querySelectorAll("a").forEach(a => a.target = "")
                }
            });
        }
    })
}

function removeHost(host) {
    chrome.storage.local.get([KEY], (kv) => {
        if (kv[KEY] === null || kv[KEY] === undefined || !kv[KEY] instanceof Array) kv[KEY] = []
        if (kv[KEY].length > 0) {
            let newList = kv[KEY].filter(item => item !== host)
            updateActiveHostArray(newList)
        }
    })
}

function clearHost() {
    updateActiveHostArray([])
}

// menus
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: "Active in this page",
        id: "active",
        contexts: ["action"]
    });
    chrome.contextMenus.create({
        "title": "Inactive in this page",
        "id": "inactive",
        "contexts": ["action"]
    });
})

// listener
chrome.contextMenus.onClicked.addListener((item, tab) => {
    if (!tab.url.startsWith("http")) return
    let targetHost = getTargetHost(tab.url)
    switch (item.menuItemId) {
        case "active":
            chrome.storage.local.get([KEY], (kv) => {
                debugger
                if (kv[KEY] === null || kv[KEY] === undefined || !kv[KEY] instanceof Array) kv[KEY] = []
                if (kv[KEY].filter(item => item === host).length === 0) {
                    let newList = [targetHost, ...kv[KEY]];
                    updateActiveHostArray(newList)
                }
            })
            break;
        case "inactive":
            removeHost(targetHost)
            break;
        default:
    }
});

function updateActiveHostArray(array) {
    chrome.storage.local.set({"STAY_ON_THIS_PAGE_ACTIVE_LIST": array}, () => {
        console.log(`update array successfully, array: ${array}`)
    })
}

function getTargetHost(url) {
    if (url.search("https://") === 0) {
        url = url.substring(8)
    } else if (url.search("http://") === 0) {
        url = url.substring(7)
        url = url.substring(0, url.indexOf("/"))
    }
    let firstSlash = url.indexOf("/")
    if (firstSlash > 0) {
        return url.substring(0, firstSlash)
    }
    return url
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.target === "clearHost") {
            clearHost()
        } else if (request.target === "removeHost") {
            removeHost(request.host)
        }
    }
);

