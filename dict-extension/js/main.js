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
