window.HN && window.jQuery && (HN.tab = function($tabId) {

	HN.debug('HN.tab is init'); 

	var options = {
        tabId: 'tab-id',                  //tab唯一标识ID*/ 
		index: 0 ,                        //默认显示第几个*/
        eventType: 'click',               //触发事件 click/mouseover*/
		tabClass: 'selecteds',            //自定义 按钮样式  字符串形式 为统一样式 eq:selecteds，数组 为一一对应样式 eq:['a','b','c','d']
		//AUTO
		autoSwitch: false,                //是否自动切换 false/true*/
		autoSwitchTime:5000,              //切换时间
		//ajax
		ajax: null                    //null {url:,type},AJAX取回数据后，会给对应DIV加一个itgeted 的CLASS 
    };
	
	if (HN.isString($tabId)) {
        options.tabId = $tabId;   
    } else if (typeof $tabId == 'object') {
        $.extend(options, $tabId);
    }
	
	var 
	autoStart,
    t = $('#'+ options.tabId),
	bar = t.find('div:first > ul > li'),
	content = t.find('.content div'),
	n=options.index;
	
	//tab init
	content.hide();	
	if (HN.isString(options.tabClass)) {  //初始化INDEX项 ，默认为0
		bar.eq(options.index).addClass(options.tabClass);
	} else  if (typeof options.tabClass == 'object') {
		bar.eq(options.index).addClass(options.tabClass[options.index]);
	}
	if (options.ajax && !content.eq(options.index).hasClass('itgeted')) {// AJAX模式下初始第一项的内容
		ajaxGet(options.index);
	}
	content.eq(options.index).show(0);
	
	if (options.autoSwitch) {		
		autoStart=setInterval(auto, options.autoSwitchTime ,n);
	}		
	
	//tab event bind
	bar.each (function(i){
		$(this).bind(options.eventType,function(){
			if (options.autoSwitch) {			
				clearInterval(autoStart);							
				n=i;
				autoStart=setInterval(auto, options.autoSwitchTime ,n);
			}	
			setTab(i);
			setContent(i);
		});
	});	
	
	//tab show and class control
	function setTab($i){
		if (HN.isString(options.tabClass)) {
			bar.removeClass(options.tabClass);
			bar.eq($i).addClass(options.tabClass);
		} else if (typeof options.tabClass == 'object') {
			bar.each ( function(j){
				bar.eq(j).removeClass(options.tabClass[j]);
			});
			bar.eq($i).addClass(options.tabClass[$i]);
		}
	}
	
	//Content box show
	function setContent($i){
		content.hide();
		if (options.ajax && !content.eq($i).hasClass('itgeted')) {
			ajaxGet($i);
		}
		content.eq($i).fadeIn(1000);
	}
	
	//ajax get Html for content box
	function ajaxGet($i){
		$.ajax({
		   type: options.ajax.type,
		   url: options.ajax.url,
		   data: "num="+$i,
		   success: function(msg){
			 content.eq($i).html(msg).addClass('itgeted');
		   }
		});
	}
	
	//
	function auto(){
		n++;
		if (n>bar.length-1) {
			n=0;
		}
		setTab(n);
		setContent(n);
	}
	
})