//xydudu 8.11/2010 CTU
//photo and content slide
//need HN, jQuery

/* *
* <div id="hn-slide">
*   <div class="hn-slide-con">
*       <div class="hn-slide-box">
*           <div><img src="01.jpg" alt="" /></div>
*           <div><img src="02.jpg" alt="" /></div>
*           <div><img src="03.jpg" alt="" /></div>
*           <div><img src="04.jpg" alt="" /></div>
*       </div>
*   </div>
*   <a href="#" class="hn-slide-prev">previous</a>
*   <a href="#" class="hn-slide-next">next</a>
* </div>
*
* */

window.HN && window.jQuery && (HN.slide = function($slideId) {
     
    HN.debug('HN.slide is init');    
    var options = {
        slideId: 'hn-slide',//slide唯一标识ID
        itemNode: 'div',    //循环个体nodeName
        repeat: true,       //是否循环
        direction: 'X',     //方向 ，X轴和Y轴
        times: 500,         //动画时间
        scrollItems: 1      //滚动个数
    };

    if (HN.isString($slideId)) {
        options.slideId = $slideId;   
    } else if (typeof $slideId == 'object') {
        $.extend(options, $slideId);   
    }

    var 
    s = $('#'+ options.slideId),
    con = s.children('div.hn-slide-con'),
    box = con.children('div.hn-slide-box'),
    prev = s.find('.hn-slide-prev'),
    next = s.find('.hn-slide-next'),
    items = box.children(options.itemNode),
    itemLen = items.length,
    itemW = $(items[0]).width() * options.scrollItems;
    itemH = $(items[0]).height() * options.scrollItems;
    //如没有找到相关HTML，提示一下
    !s.length && HN.debug('没有找到id为"'+ options.slideId +'"的东东');

    //定义滚动个体的父容器宽度
    options.direction === 'X' && box.width((itemW/options.scrollItems) * itemLen);

    //绑定事件
    prev.length && prev.click(goPrev); 
    next.length && next.click(goNext); 

    function goNext() {
        HN.debug(options);
        var 
        WH = options.direction === 'X' ? itemW : itemH,
        start = scroll(),
        end = start + WH + 1,
        i = Math.ceil(itemLen/options.scrollItems) - 1;

        if (i === Math.ceil(start/WH)) {
            options.repeat && goTo(1); 
            return false;
        } 
        anim(start, end);
        return false;
    }

    function goPrev() {
        var 
        start = scroll(),
        end = start - (options.direction === 'X' ? itemW : itemH);
        if (end < 0) {
            options.repeat && goTo(itemLen);
            return false;
        } 
        anim(start, end);
        return false;
    }
    
    function goTo($pos) {
        var
        //start = con.scrollLeft(),
        start = scroll(),
        end = ($pos-1) * (options.direction === 'X' ? itemW : itemH);

        anim(start, end);

    }

    function anim($start, $end) {
        $({w: $start}).animate({w: $end}, {
            duration: options.times,
            step: function() {
                scroll(this.w);
            },
            complete: function() {
                HN.debug(this);    
            }
        });
    }

    function scroll($v) {
        if ($v) {
            return (options.direction === 'X') ?
                con.scrollLeft($v):
                con.scrollTop($v);
        } else {
            return options.direction === 'X' ?
                con.scrollLeft():
                con.scrollTop();
        }    
    }

    return {
        //外部方法 
        next: goNext,
        goPrev: goPrev,
        goTo: goTo

    };
    
});
