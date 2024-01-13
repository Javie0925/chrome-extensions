$(function () {

    // 生成图片列表
    sheets.forEach(sheet => {
        newEle = '<img src="sheets/' + sheet + '" alt="pandas">\n' +
            '            <span class="pt-5">\n' +
            '                <button class="layui-btn">' + sheet.split(".")[0] + '</button>\n' +
            '            </span>'
        $(".box").html($(".box").html() + newEle)
    })

    // 获取图片的宽度(200px)
    let imgWidth = $('img').outerWidth(); // 200

    waterfallHandler();

    // 瀑布流处理
    function waterfallHandler() {
        // 获取图片的列数
        let column = parseInt($(window).width() / imgWidth);

        // 高度数组
        let heightArr = [];
        for (let i = 0; i < column; i++) {
            heightArr[i] = 0;
        }

        // 遍历所有图片进行定位处理
        $.each($('img'), function (index, item) {
            // 当前元素的高度
            let itemHeight = $(item).outerHeight();
            // 高度数组最小的高度
            let minHeight = Math.min(...heightArr);
            // 高度数组最小的高度的索引
            let minIndex = heightArr.indexOf(minHeight);

            $(item).css({
                position: 'absolute',
                top: minHeight + 'px',
                left: minIndex * imgWidth + 'px',
            });
            heightArr[minIndex] += itemHeight;
            span = $("span")[index]
            $(span).css({
                position: 'absolute',
                top: minHeight + 'px',
                left: minIndex * imgWidth + 'px',
            })
        });
    }

    $("button").on('click', function () {
        window.open("./sheets/" + this.innerText + ".png");
    })

    // 窗口大小改变
    $(window).resize(function () {
        waterfallHandler();
    });
});
