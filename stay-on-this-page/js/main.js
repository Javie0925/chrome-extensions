(() => {
    displayHostArray()
})()

function displayHostArray() {
    chrome.storage.local.get(["STAY_ON_THIS_PAGE_ACTIVE_LIST"], function (kv) {
        let activeHostArray = kv["STAY_ON_THIS_PAGE_ACTIVE_LIST"]
        if (!activeHostArray || activeHostArray.length === 0) {
            $(".layui-tab").html(
                `
                    <div class="w-100 row justify-content-center">
                        <div class="col-1">
                        <i class="layui-icon layui-icon-face-cry" style="font-size: 30px;"></i>
                        </div>
                    </div>
                    `
            )
        } else {
            let innerHtml = '';
            activeHostArray.map(host => {
                let icon = 'layui-icon-delete'
                innerHtml +=
                    `
                        <div class="list-group-item list-group-item-action row justify-content-between" style="display: flex !important;--bs-gutter-x:0">
                            <a href="#" class="col" aria-current="true" style="overflow: hidden">${host}</a>
                            <i class="layui-icon ${icon} col-1" id="removeThisHost" style="overflow:hidden;" data-host="${host}"></i>   
                        </div>
                        `
            })
            $(".layui-tab").html(
                `
                    <div class="w-100">
                        <button class="layui-btn mb-1 w-100" id="clear">Clear</button>
                    </div>
                    <div class="list-group">
                      ${innerHtml}
                    </div>
                    `
            )
            $("#clear").on("click", event => {
                clearHost();
            })
            $("#removeThisHost").on("click", event => {
                removeHost($(event.target).data("host"))
            })
        }
    })
}

const KEY = "STAY_ON_THIS_PAGE_ACTIVE_LIST"

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

function updateActiveHostArray(array) {
    chrome.storage.local.set({"STAY_ON_THIS_PAGE_ACTIVE_LIST": array}, () => {
        console.log(`update array successfully, array: ${array}`)
    })
    displayHostArray()
}
