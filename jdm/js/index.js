window.onload = function() {
    // 顶部搜索
    search()
    // 轮播图
    banner()
    // 倒计时
    downTime()
}

var search = function () {
    // 1 默认固定顶部透明背景
    // 2 当页面滚动 透明度加大
    // 3 滚动到一定时候 透明度不变

    var searchBox = document.querySelector('.jd_search_box')
    var banner = document.querySelector('.jd_banner')
    var height = banner.offsetHeight;
    window.onscroll = function () {
        //当指定了doctype为html时候 使用 documentElement
        var scrollTop = document.documentElement.scrollTop
        // console.log(document.documentElement.scrollTop)
        var opacity = 0;
        if (scrollTop < height) {
            opacity = scrollTop / height * 0.85
        } else {
            opacity = 0.85;
        }
        searchBox.style.background = 'rgba(201, 21, 35,' + opacity + ')'
    }
}

var banner = function () {
    /*1. 自动轮播图且无缝   定时器，过渡*/
    /*2. 点要随着图片的轮播改变  根据索引切换*/
    /*3. 滑动效果  利用touch事件完成*/
    /*4. 滑动结束的时候    如果滑动的距离不超过屏幕的1/3  吸附回去   过渡*/
    /*5. 滑动结束的时候    如果滑动的距离超过屏幕的1/3  切换（上一张，下一张）根据滑动的方向，过渡*/

    var banner = document.querySelector('.jd_banner')
    // 屏幕宽度
    var width = banner.offsetWidth;
    console.log(width)

    var imageBox = banner.querySelector('ul:first-child')
    var pointBox = banner.querySelector('ul:last-child')
    var points = pointBox.querySelectorAll('li')

    var addTransition = function () {
        imageBox.style.transition = 'all 0.2s'
        imageBox.style.webKitTransition = 'all 0.2s' // 做兼容
    }

    var removeTransition = function () {
        imageBox.style.transition = 'none'
        imageBox.style.webKitTransition = 'none'
    }

    var setTranslateX = function (translateX) {
        imageBox.style.transform = 'translateX(' + (translateX) + 'px)' // 向左边移动
        imageBox.style.webKitTransform = 'translateX(' + (translateX) + 'px)' // 向左边移动
    }


    // 程序核心 index变量
    var index = 1
    var timer = setInterval(function() {
        // 加过度
        addTransition()
        // 做位移
        index++;
        setTranslateX(-index*width)
    }, 1500)

    imageBox.addEventListener('transitionend', function () {
        if (index >= 9) {// 移动了 8个图片位移了 最后一张图片了(实际是倒数第二张)
            index = 1;
            // // 清除过度 从最后一张直接移动到第一张
            removeTransition()
            setTranslateX(-index*width)
        } else if(index <= 0) { // 滑动的时候
            index = 8;
            removeTransition()
            setTranslateX(-index*width)
        }
        // index 1-8
        setPoint(index - 1)
    })

    // 设置点的方法
    var setPoint = function(index) {
        for (var i = 0; i < points.length; i++) {
            var obj = points[i]
            obj.classList.remove('now')
        }
        points[index].classList.add('now')
    }

    var startX = 0
    var distanceX = 0
    imageBox.addEventListener('touchstart', function (e) {
        // 记录起始位置
        startX = e.touches[0].clientX
        // 清除定时器
        clearInterval(timer)  
    })

    imageBox.addEventListener('touchmove', function (e) {
        var moveX = e.touches[0].clientX
        distanceX = moveX - startX

        var translateX = -index * width + distanceX;
        removeTransition()
        setTranslateX(translateX)

    })

    imageBox.addEventListener('touchend', function (e) {
        if (Math.abs(distanceX) < width / 3) {
            // 吸附
            addTransition()
            setTranslateX(-index * width)
        } else {
            /*切换*/
            /*右滑动 上一张*/
            if (distanceX > 0) {
                index--;
            }
            /*左滑动 下一张*/
            else {
                index++;
            }
            /*根据index去动画的移动*/
            addTransition();
            setTranslateX(-index * width);
        }

        timer = setInterval(function() {
        // 加过度
            addTransition()
            // 做位移
            index++;
            setTranslateX(-index*width)
        }, 1500)

        // 重置参数 严谨
        startX = 0
        distanceX = 0
    })

}

var downTime = function () {
    var timeBoxs = document.querySelector('.sk .time').querySelectorAll('span')
    // console.log(timeBoxs)
    // 倒计时
    var time = 2 * 60 * 60 
    // 每一秒更新显示的事件
    var timer = setInterval(function () {
        time --
        var h = Math.floor(time / 3600)
        var m = Math.floor(time % 3600 / 60)
        var s = time % 60
        timeBoxs[0].innerHTML = Math.floor(h / 10)
        timeBoxs[1].innerHTML = h % 10
        timeBoxs[3].innerHTML = Math.floor(m / 10)
        timeBoxs[4].innerHTML = m % 10
        timeBoxs[6].innerHTML = Math.floor(s / 10)
        timeBoxs[7].innerHTML = s % 10
        if (time <= 0) {
            clearInterval(timer)
        }
    }, 1000)
}


