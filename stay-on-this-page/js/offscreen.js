chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.target === "offscreen") {
            doSearch(request.text, request.urlMap)
        }
    }
);
