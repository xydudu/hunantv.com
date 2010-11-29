//need HN, jQuery
window.HN && window.jQuery && (HN.tInput = function($options) {
    
	HN.debug('HN.tInput is init'); 

	var options = {
    },obj;
	
	if (HN.isString($options)) {
		HN.debug('options is wrong!');
    } else if (typeof $options == 'object') {
        $.extend(options, $options);
    }
	
	HN.isString(options.target)?obj=$(options.target):edit(options.target);
	
	//绑定文本HOVER样式
	$(obj).live('mouseover',(function(){
		options.css?$(this).addClass(options.css):$(this).css({background:'#e3e3e3'});
	}));
	$(obj).live('mouseout',(function(){
		options.css?$(this).removeClass(options.css):$(this).css('background','none');
	}));
	
	$(obj).live('click',(function(){
		edit($(this));
	}));
	
	function edit($obj){
		var o=$obj,
		html=o.html(),
		input,
		w=+o.width()+8;
		o.hide();
		o.after('<input type="text" name="'+o.attr('alt')+'" style="width:'+w+'px;" value="'+html+'" />');
		input=o.next('input').eq(0);
		input.focus();
		input.bind('blur',(function(){
			var 
			v=input.val(),
			id=input.attr('name'),
			data={};
			data[options.id] = id;
			data[options.value] = v;
			HN.debug(data)
			
			if(v!=html){
				input.attr('readonly','readonly');
				HN.ajax.post(options.url,data,function($data){
					input.remove();
					o.html(v).show();
				},
				function(){
					input.removeAttr('readonly');
					o.show();
				});
			}else{
				input.remove();
				o.show();				
			}
		}));
	
	}
	
});

