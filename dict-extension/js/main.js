$("#back_page").on("click", event => {
    console.log(111)
    window.open(chrome.extension.getURL("back.html"))
    window.open("https://cn.bing.com/dict/search?q=extension")
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


function search() {
    let word = document.querySelector("#searchIpt").value
    if (word) {
        word = word.trim()
        if (word.split(" ").length > 1 || isChinese(word)) {
            url = `https://cn.bing.com/search?q=翻译：${word}`;
        } else {
            url = `https://cn.bing.com/dict/search?q=${word}`;
        }
        window.open(url);
    }
}
function isChinese(text) {
    var patrn = /[\u4e00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (!patrn.exec(text)) {
        return false;
    } else {
        return true;
    }

}