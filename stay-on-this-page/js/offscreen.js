chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.target === "offscreen") {
            window.location.href = request.foreword
        }
    }
);


