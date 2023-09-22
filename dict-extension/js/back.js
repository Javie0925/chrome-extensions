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
// youdao
// chrome.runtime.onInstalled.addListener(async () => {
//     chrome.contextMenus.create({
//         type: 'normal',
//         title: 'YouDao Dict',
//         id: 'youdao',
//         contexts: ['all'],
//     });
// });


chrome.contextMenus.onClicked.addListener((item, tab) => {
    let text = item.selectionText.trim()
    doSearch(text)
});
