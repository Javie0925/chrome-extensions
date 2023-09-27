const SEARCH_HISTORY = "SEARCH_HISTORY"
const FAVORITE = "FAVORITE"

$("#back_page").on("click", event => {
    window.open(chrome.extension.getURL("back.html"))
})
$("#back_title").on("click", event => {
    var bg = chrome.extension.getBackgroundPage()
    alert(bg.document.title)
})
$("#set_title").on("click", event => {
    var title = prompt("please enter a title")
    var bg = chrome.extension.getBackgroundPage()
    bg.document.title = title
    alert(bg.document.title)
})
$("#callbackjs").on("click", event => {
    var bg = chrome.extension.getBackgroundPage()
    bg.backjs()
})

$("#searchBtn").on("click", event => {
    search();
})
$("#searchIpt").on("keyup", event => {
    if (event.keyCode === 13) {
        search();
    }
})
$("#historyTab").on("click", event => {
    getHistory()
})
$("#favoriteTab").on("click", event => {
    getFavorite()
})

function search() {
    let word = document.querySelector("#searchIpt").value
    doSearch(word)
}

$("div#pastingSwitch").on('click', event => {
    if ($("div#pastingSwitch>div").hasClass("layui-form-onswitch")) {
        chrome.storage.local.set({"AUTOMATIC_CLIPBOARD_PASTING": true});
        document.execCommand("paste");
    } else {
        chrome.storage.local.set({"AUTOMATIC_CLIPBOARD_PASTING": false})
    }
})

window.onload = function () {
    chrome.storage.local.get("AUTOMATIC_CLIPBOARD_PASTING", function (kv) {
        let on = kv["AUTOMATIC_CLIPBOARD_PASTING"]
        if (on) {
            document.execCommand("paste")
            search()
        } else {
            $("div#pastingSwitch > div").removeClass("layui-form-onswitch");
            $("div#pastingSwitch > div div").text("OFF")
        }
    })
};

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

