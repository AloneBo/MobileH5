;$(function () {
	// 轮播图
    banner()
    initMobileTab()
})


function banner () {
	// 1 获取数据
	// 2 渲染页面
	// 监听页面改变 重新渲染

	/*做数据缓存*/
    var getData = function (callback) {
        /*缓存了数据*/
        if(window.data){
            callback && callback(window.data);

        }else {
            /*1.获取轮播图数据*/
            $.ajax({
                type:'get',
                url:'js/data.json',
                /*强制转换后台返回的数据为json对象*/
                /*强制转换不成功程序报错，不会执行success,执行error回调*/
                dataType:'json',
                data:'',
                success:function (data) {
                	console.log('get json data')
                    window.data = data;
                    callback && callback(window.data);
                }
            });
        }
    }
    var render = function () {
        getData(function (data) {
            /*2.根据数据动态渲染  根据当前设备  屏幕宽度判断 */
            var isMobile = $(window).width() < 768 ? true : false;
            //console.log(isMobile);
            /*2.1 准备数据*/
            /*2.2 把数据转换成html格式的字符串*/
            /*使用模版引擎：那些html静态内容需要编程动态的*/
            /*发现：点容器  图片容器  新建模版*/
            /*开始使用*/
            /*<% console.log(list); %> 模版引擎内不可使用外部变量 */
            var pointHtml = template('pointTemplate',{list:data});
            //console.log(pointHtml);
            var imageHtml = template('imageTemplate',{list:data,isMobile:isMobile});
            //console.log(imageHtml);
            /*2.3 把字符渲染页面当中*/
            $('.carousel-indicators').html(pointHtml);
            $('.carousel-inner').html(imageHtml);
            console.log('render')
        });
    }
    /*3.测试功能 页面尺寸发生改变事件*/
    $(window).on('resize',function () {
        render();
        /*通过js主动触发某个事件*/
    }).trigger('resize')

    // 移动端 左右滑动切换轮播图
    var startX = 0
    var distanceX = 0
    var isMove = false
    $('.wjs_banner').on('touchstart', function (e) {
    	startX = e.originalEvent.touches[0].clientX

    }).on('touchmove', function (e) {
    	var moveX = e.originalEvent.touches[0].clientX
    	distanceX = startX - moveX
    	isMove = true
    }).on('touchend', function (e) {
		if (isMove && Math.abs(distanceX) > 50) {
			// 左
			if (distanceX > 0) {
				$('.carousel').carousel('next');
			}else {
				$('.carousel').carousel('prev');
			}
            isMove = 0
            distanceX = 0
            startX = 0
		}
    	
    })
}

var initMobileTab = function () {
    // 1 解决换行问题
    // 2 修改结构
    // 3 可以自己实现滑动效果 或者 使用 iscroll
    var $navTabs = $('.wjs_product .nav-tabs')
    var width = 0;
    $navTabs.find('li').each(function (i, item)  {
        let $currLi = $(this);
        let liWidth = $currLi.outerWidth(true) // margin不能包含在这里 width() 函数
        width += liWidth
        
    })
    console.log(width)
    $navTabs.width(width)

    new IScroll($('.nav-tabs-parent')[0], {
        scrollX: true,
        scrollY: false,
        click: true
    })

}

