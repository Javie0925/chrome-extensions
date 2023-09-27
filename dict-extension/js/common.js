const SEARCH_HISTORY = "SEARCH_HISTORY"
const FAVORITE = "FAVORITE"

function isChinese(text) {
    var patrn = /[\u4e00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (!patrn.exec(text)) {
        return false;
    } else {
        return true;
    }

}

function doSearch(text) {
    if (!text) return
    text = text.trim()
    let url
    if (text.split(" ").length > 1 || isChinese(text)) {
        chrome.storage.local.get("ACTIVATED_TRANS", function (kv) {
            url = kv["ACTIVATED_TRANS"] || `https://fanyi.baidu.com/#zh/en/`;
            url = url.concat(text)
            recordAndOpen(text, url);
        })
    } else {
        chrome.storage.local.get("ACTIVATED_DICT", function (kv) {
            url = kv["ACTIVATED_DICT"] || `https://cn.bing.com/dict/search?q=`;
            url = url.concat(text)
            recordAndOpen(text, url);
        })
    }
    //chrome.tabs.create({ url: url.href, index: (tab && tab.index) ? tab.index+100 : 0 });
}

async function recordAndOpen(text, url) {
    store(text);
    window.open(url);
}

function store(text) {
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

function getHistory() {
    chrome.storage.local.get(SEARCH_HISTORY, function (kv) {
        chrome.storage.local.get(FAVORITE, function (fav) {
            let favArr = fav[FAVORITE] ? fav[FAVORITE] : []
            let arr = kv[SEARCH_HISTORY]
            let innerHtml = '';
            if (!arr || arr.length === 0) {
                $("#historyCont").html(
                    `
                    <div class="w-100 row justify-content-center">
                        <div class="col-1">
                        <i class="layui-icon layui-icon-face-cry" style="font-size: 30px;"></i>
                        </div>
                    </div>
                    `
                )
            } else {
                arr.map(w => {
                    let icon = 'layui-icon-rate-solid'
                    if (favArr.indexOf(w) < 0) icon = 'layui-icon-rate'
                    innerHtml +=
                        `
                        <div class="list-group-item list-group-item-action row justify-content-between" style="display: flex !important;--bs-gutter-x:0">
                            <a href="#" class="col" aria-current="true">${w}</a>
                            <i class="layui-icon ${icon} col-1 icon-in-history" style="color: #ffda1e;" data-word="${w}"></i>   
                        </div>
                        `
                })
                $("#historyCont").html(
                    `
                    <div class="w-100">
                        <button class="layui-btn mb-1 w-100" id="clear">Clear</button>
                    </div>
                    <div class="list-group">
                      ${innerHtml}
                    </div>
                    `
                )
                $(".list-group-item").on("click", event => {
                    let text = event.target.innerText
                    doSearch(text)
                })
                $("#clear").on("click", event => {
                    clearHistory();
                })
                $(".icon-in-history").on("click", event => {
                    setFavorite($(event.target).data('word'));
                })
            }
        })
    })
}

function clearHistory() {
    chrome.storage.local.set({"SEARCH_HISTORY": []});
    getHistory();
}

function setFavorite(text) {
    if (text instanceof String) {
        text = text.trim()
    } else {
        text = '' + text
    }
    chrome.storage.local.get(FAVORITE, function (kv) {
        debugger
        let arr = kv[FAVORITE]
        if (!arr || !(arr instanceof Array)) arr = []
        if (arr.indexOf(text) >= 0) {
            arr = arr.filter(w => w !== text)
            chrome.storage.local.set({"FAVORITE": arr}, function () {
                console.log(`remove favorite:[${text}] success`)
            })
        } else {
            arr = [text, ...arr]
            chrome.storage.local.set({"FAVORITE": arr}, function () {
                console.log(`set favorite:[${text}] success`)
            })
        }
        getHistory()
    })
}

function getFavorite() {
    chrome.storage.local.get(FAVORITE, function (kv) {
        let arr = kv[FAVORITE]
        let innerHtml = '';
        if (!arr || arr.length === 0) {
            $("#favCont").html(
                `
            <div class="w-100 row justify-content-center">
                <div class="col-1">
                <i class="layui-icon layui-icon-face-cry" style="font-size: 30px;"></i>
                </div>
            </div>
            `
            )
        } else {
            arr.map(w => {
                innerHtml +=
                    `
                        <div class="list-group-item list-group-item-action row justify-content-between" style="display: flex !important;--bs-gutter-x:0">
                            <a href="#" class="col">${w}</a>
                            <i class="layui-icon layui-icon-rate-solid col-1 icon-in-fav" style="color: #ffda1e;" data-word="${w}"></i>   
                        </div>
                
                `
            })
            $("#favCont").html(
                `
            <div class="w-100"><button class="layui-btn mb-1 w-100" id="clearFav">Clear</button></div>
            <div class="list-group">
              ${innerHtml}
            </div>
            `
            )
            $(".list-group-item").on("click", event => {
                let text = event.target.innerText
                doSearch(text)
            })
            $("#clearFav").on("click", event => {
                clearFavorite();
            })
            $(".icon-in-fav").on("click", event => {
                debugger
                removeFav($(event.target).data("word"));
            })
        }
    })
}

function removeFav(text) {
    chrome.storage.local.get(FAVORITE, function (kv) {
        let arr = kv[FAVORITE]
        arr = arr.filter(w => w !== text)
        chrome.storage.local.set({"FAVORITE": arr}, function () {
            console.log('remove favorite success')
        })
        getFavorite()
    })
}

function clearFavorite() {
    if (confirm("Are you sure to clear favorite?")) {
        debugger
        chrome.storage.local.set({"FAVORITE": []});
        getFavorite();
    }
}
