//need HN, jQuery
window.HN && window.jQuery && (HN.xinput = function($options) {
    
	HN.debug('HN.xinput is init'); 

	var options = {
    };
	
	if (HN.isString($options)) {
		HN.debug('options is wrong!');
    } else if (typeof $options == 'object') {
        $.extend(options, $options);
    }
	
	$(options.target).hover(function(){
		options.css?$(this).addClass(options.css):$(this).css({border:'1px solid #063'});
	},function(){
		options.css?$(this).removeClass(options.css):$(this).css('border','none');
	});
	
	$(options.target).bind('click',(function(){
		var o=$(this),
		html=o.html(),
		input,
		w=+o.width()+8;
		o.hide();
		o.after('<input type="text" style="width:'+w+'px;" value="'+html+'" />');
		input=o.next('input').eq(0);
		input.focus();
		input.bind('blur',(function(){
			var 
			v=input.val(),
			data={val:v};
			input.attr('readonly','readonly')
			HN.ajax.post(options.url,data,function(){
				input.remove();
				o.html(v).show();
			},
			function(){
				input.removeAttr('readonly');
				input.css('border','1px solid #f33');
			});
		}));
	}));
	
	
	
});

