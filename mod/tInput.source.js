//need HN, jQuery 
window.HN && window.jQuery && (HN.tInput = function($options) {
    
	HN.debug('HN.tInput is init'); 

	var options = {
		width:80
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
	
	$(obj).unbind('click').bind('click',(function(){
		edit($(this));
	}));
	
	function edit($obj){
		var o=$obj,
		html=o.html(),
		input,
		w=+o.width()+8;
		if(options.width){w=options.width}
		o.hide();
		o.after('<input type="text" name="'+o.attr('alt')+'" style="width:'+w+'px;" value="'+html+'" />');
		input=o.next('input').eq(0);
		input.focus();
		input.bind('blur',(function(){
			var 
			v=input.val(),
			id=input.attr('name'),
			data={};
			if(options.length&&v.replace(/[^\x00-\xff]/g,"**").length>options.length){
				alert('只能允许长度在'+options.length+'个字符以内!');
				input.focus();
			}else{
				data[options.id] = id;
				data[options.value] = v;			
				if(v!=html){
					input.attr('readonly','readonly');
					HN.ajax.post(options.url,data,function($data){
						input.remove();
						o.html(v).show();
						if(options.callback){
							options.callback.call()
						}
					},
					function($data){
						if($data=='parse-error'){
							alert('修改失败,输入内容不符合条件!');
						}else if($data=='not-login'){
							alert('没有登陆!');
							HN.login().dialogLoginForm(1);
						}
						input.removeAttr('readonly');	
						input.css('border','1px solid #f66')
					});
				}else{
					input.remove();
					o.show();				
				}
			}
		}));
		input.focus();
	
	}
	
});

