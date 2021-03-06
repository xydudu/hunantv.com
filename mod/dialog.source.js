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
        cssFile: false,
        className: false,
        tmpl: false,
        id: 'hn-dialog'
        //cssFile: HN.config.url.js +'css/dialog.css'
    },
    //层HTML结构
    //box = [
    //    '<div id="hn-dialog">',
    //    '<div id="hn-dialog-head"></div>',
    //    '<div id="hn-dialog-body"></div>',
    //    '<div id="hn-dialog-foot"></div>',
    //    '</div>'
    //].join(''),

    box = [
        '<div class="f-all" id="{{id}}">',
        '<div class="f-top">',
        '<div class="f-top-l" ></div>',
        '<div class="f-top-r" ></div>',
        '<div class="f-top-m w-top-m"></div>',
        '</div>',
        '<div class="f-main">',
        '<div class="f-main-l w-main-l"></div>',
        '<div class="f-main-m w-main-m" id="{{id}}-body">',

        '</div>',
        '<div class="f-main-r w-main-r">',
        '<div class="f-main-r-bg"></div>',
        '</div>',
        '</div>',
        '<div class="f-buttom">',
        '<div class="f-buttom-l"></div>',
        '<div class="f-buttom-r"></div>',
        '<div class="f-buttom-m w-buttom-m">',
        '<div class="f-buttom-m-bg"></div>',
        '</div>',
        '</div>',
        '</div>'
    ].join(''),

    //是否IE6
    ie6 = HN.ie6(),
    //是否引入CSS
    cssIsLoaded = 0,
    //遮罩层HTML结构
    overlay = [
        '<iframe id="{{id}}-bgframe" framebroder=0 />',
        '<div id="{{id}}-overlay"></div>'
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
        !$('#'+ options.id).length && $('body').append(options.tmpl ? options.tmpl : box.replace(/{{id}}/g, options.id));
        options.bgFrame && createBG();
           
        wrapper = $('#'+ options.id);
        head = $('#'+ options.id +'-head');
        body = $('#'+ options.id +'-body');
        foot = $('#'+ options.id +'-foot');
        
        options.className && wrapper.attr('className', options.className);
        //IE6下的位置
        if (ie6) {
            //滚动的时候
            $(window).scroll(center);
            //改变大小时
            $(window).resize(function() {
                if (HN.dialog.closed) return;
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
        if (HN.dialog.closed) return;

        var scrollTop = $(window).scrollTop();
        //if (!wrapper.posed) 
            wrapper.css('top', +scrollTop + ($(window).height()  - wrapper.height())/ 2);

        wrapper.posed = true;
        ie6 && bg &&
            bg.css('top', scrollTop),
            bgiframe.css('top', scrollTop);

        return false;
    }

    //更新层状态
    function updateBox() {
        //HN.debug(options);
        //HN.debug('IE6? ---------'+ ie6);

        if (!wrapper) return;
        
        var attr = {
            'width': options.width,
            'top': getTop(wrapper.height()),
            'marginLeft': -(options.width/2)
        },
        view = viewHW();

        //ie6 && (attr.position = 'absolute');
        attr.position = 'absolute';
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

        center();
        
        bindClose();
    }
    //计算层在Y轴最佳位置
    function getTop($height) {
        var view = viewHW();
        return (view.height-$height)/3;     
    }
	
	function getLeft($width) {
        var view = viewHW();
        return (view.width-$width)/3;     
    }
    //创建背景遮罩层
    function createBG() {
        if (!bg && !bgiframe) {
            $('body').append(overlay.replace(/{{id}}/g, options.id)); 
            bg = $('#'+ options.id +'-overlay');
            bgiframe = $('#'+ options.id +'-bgframe');
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
                
                HN.isString($options) && ($options = {body: $options});
                $.extend(options, $options);

                //创建html
                wrapper ? wrapper.show() : createBox();

                options.cssFile && insertCss();
                head.html(options.title);
                body.html(options.body);
                foot.html(options.foot);
            }
            HN.dialog.closed = false;
            bg && bg.show();     
            bgiframe && bgiframe.show();
            updateBox();
        },

        close: function() {
            HN.dialog.closed = true;
            wrapper && wrapper.hide();     
            bg && bg.hide();     
            bgiframe && bgiframe.hide();
            wrapper.posed = false;
            return false;
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
            var 
            o = this,
            tmpl = [
                '<div class="w740-f">',
                '<div class="zz w740-f-notice">'+ $text +'</div>',
                /*
                '<div class="c w740-f-sumbit">',
                '<div class="l w740-pl">',
                '<input type="image" src="/ui/mangoq/2010v1/images/button/sumbit_65x25.jpg" name="" />',
                '</div>',
                '<div class="l"><a href="#">取消</a></div>',
                '</div>',
                */
                '</div>'
            ].join('');

            o.open({
                body: tmpl,
                width: 178,
                id: 'hn-dialogalert',
                className: 'f-all w-w178h101'
            });
            o.reSize(178, 101);
            head.hide();
            foot.hide();
            $times && setTimeout(o.destroy, $times);
        },

        getAttrs: function($id) {
            var 
            elem = $('#'+ $id),
            c = elem.attr('className').split('|');

            return {
                'html': elem.html(),
                'className': c[0],
                'width': c[1]
            };    
        },
		reSize: function($width, $height) {
			var 
            o=this,
            left,
            top;

			if ($width > 0) {
				wrapper.css('width', $width + 24);
				//left = ($width + 24) / 2;
				$('.w-top-m,.w-main-m,.w-buttom-m').css('width', $width);
				//wrapper.css('margin-left', -left);
			}
			if ($height > 0) {
				//top=getTop($height+24);
				//if(top<0)top=10;
				wrapper.css('height',$height+24+'px');
				$('.w-main-l,.w-main-m,.w-main-r').css('height',$height+'px');
				//wrapper.css('top',top+'px');
			}
			$('#hn-dialog,#hn-dialog-bgframe,#hn-dialog-overlay').show(0);
			//$('.hn-dialog-close').bind('click',(function(){HN.dialog.close();}));
            center();
		}
    };
    
}(window));

