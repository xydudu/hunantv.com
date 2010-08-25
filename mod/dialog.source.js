//xydudu 7.28/2010 CTU
//dialog mod
//need HN, jQuery
//need CSS dialog.css
window.HN && window.jQuery && (HN.dialog = function(window, undefined) {
    
    var 
    wrapper = head = body = foot = bg = bgiframe = 0,
    //初始设置
    options = {
        title: 'This is a dialog', //set a dialog title
        body: '', // html content
        foot: '', // foot
        width: 300, //nfc
        bgFrame: true,
        opacity: 0.5,
        disableBgClick: false,
        closeClassName: 'hn-dialog-close',
        cssFile: HN.config.url.js +'css/dialog.css'
    },
    //层HTML结构
    box = [
        '<div id="hn-dialog">',
        '<div id="hn-dialog-head"></div>',
        '<div id="hn-dialog-body"></div>',
        '<div id="hn-dialog-foot"></div>',
        '</div>'
    ].join(''),
    //是否IE6
    ie6 = HN.ie6(),
    //是否引入CSS
    cssIsLoaded = 0,
    //遮罩层HTML结构
    overlay = [
        '<iframe id="hn-dialog-bgframe" framebroder=0 />',
        '<div id="hn-dialog-overlay"></div>'
    ].join(''),
    viewHW = function() {
        var doc = $(window);
        return {
            height: doc.height(),
            width: doc.width()
        };
    };
    //引入相关CSS
    function insertCss() {
        if (cssIsLoaded) return;
        HN.loadCSS(options.cssFile);
        cssIsLoaded = 1;
    }
    //创建
    function createBox() {
        !$('#hn-dialog').length && $('body').append(box);
        options.bgFrame && createBG();
           
        wrapper = $('#hn-dialog');
        head = $('#hn-dialog-head');
        body = $('#hn-dialog-body');
        foot = $('#hn-dialog-foot');

        //IE6下的位置
        if (ie6) {
            //滚动的时候
            $(window).scroll(center);
            //改变大小时
            $(window).resize(function() {
                //改变窗体大小    
                var view = viewHW();
                bg &&
                    bg.css(view),
                    bgiframe.css(view);
            });

        }

    }
    
    //make element in a cnter position
    function center() {
        var scrollTop = $(window).scrollTop();
        wrapper.css('top', scrollTop + ($(window).height() / 2));
        bg &&
            bg.css('top', scrollTop),
            bgiframe.css('top', scrollTop);

        return false;
    }

    //更新层状态
    function updateBox() {
        HN.debug(options);
        HN.debug('IE6? ---------'+ ie6);

        if (!wrapper) return;
        
        var attr = {
            'width': options.width,
            'marginTop': getMarginTop(wrapper.height()),
            'marginLeft': -(options.width/2)
        },
        view = viewHW();

        ie6 && (attr.position = 'absolute');
        wrapper.css(attr);
        
        //重新设定遮罩层大小
        if (bg) {
            //设定透明度
            view.opacity = options.opacity;
            bg.css(view);
            bgiframe.css(view);

            !options.disableBgClick && bg.click(HN.dialog.close);

            if (ie6) {
                bg.css('position', 'absolute');
                bgiframe.css('position', 'absolute');
            }
        }
        
        bindClose();
    }
    //计算层在Y轴最佳位置
    function getMarginTop($height) {
        var view = viewHW();
        return -(view.height-$height)/3;     
    }
    //创建背景遮罩层
    function createBG() {
        if (!bg && !bgiframe) {
            $('body').append(overlay); 
            bg = $('#hn-dialog-overlay');
            bgiframe = $('#hn-dialog-bgframe');
        }
    }

    //生成关闭按钮
    function bindClose() {
        var elem = $('.'+ options.closeClassName);        
        elem.length && elem.click(HN.dialog.close);   
    }

    return {
        open: function($options) {
            //如果类似 click(open) 会默认传入第一个参数
            ($options && $options.type) && ($options = undefined);
            if ($options === undefined) {
                HN.debug('is undefined');
                // 直接调用 HN.dialog.open(); 
                // 打开原来创建的 dialog
                wrapper && wrapper.show();    
            } else {
                //创建html
                wrapper ? wrapper.show() : createBox();

                HN.isString($options) && ($options = {body: $options});
                $.extend(options, $options);
                
                insertCss();
                head.html(options.title);
                body.html(options.body);
                foot.html(options.foot);
            }
            bg && bg.show();     
            bgiframe && bgiframe.show();
            updateBox();
        },

        close: function() {
            wrapper && wrapper.hide();     
            bg && bg.hide();     
            bgiframe && bgiframe.hide();
        },

        destroy: function() {
            wrapper && wrapper.remove();     
            bg && bg.remove();     
            bgiframe && bgiframe.remove();     
            wrapper = head = body = foot = bg = bgiframe = 0;
        },
        
        //通用弹出消息
        //如设定 $times 则在对应时间后隐藏掉此框
        alert: function($text, $times) {
            var o = this;
            o.open($text);
            head.hide();
            foot.hide();
            $times && setTimeout(o.destroy, $times);
        }
    };
    
}(window));

