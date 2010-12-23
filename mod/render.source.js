//11.19/2010 xydudu
//修改模块 
//
window.HN && HN.tmpl && (HN.render = function($options) {
    
    var 
    box = $('#'+ $options.id),
    showid = $options.id +'show',
    editid = $options.id +'edit',
    showTmpl = $('#'+ showid).html(),
    editTmpl = $('#'+ editid).html();

    //editHtml = HN.tmpl(editTmpl, $options.data);
    
    var method = {
        callback: false,
        
        edit: function() {
            
            //HN.debug($options.data);
            box.html(HN.tmpl(editTmpl, $options.data));
            method.callback && method.callback.call();
            method.callback = false;
            $options.bindEdit(method);
            
        },

        cancel: function() {
            box.html(HN.tmpl(showTmpl, $options.data));  
            $options.bindShow(method);
        },

        post: function() {
            var 
            form = box.find('form'),
            url = form.attr('action'),
            params = form.serialize();
                
            HN.ajax.post(url, params, function($data) {
                $options.data = $data; 
                box.html(HN.tmpl(showTmpl, $data));
                method.callback && method.callback($data);
                method.callback = false;
                $options.bindShow(method);
            }, function($data) {
                //error
                //HN.dialog.alert('操作出错，请重试！',2000);
                box.html(HN.tmpl(showTmpl, $options.data));  
                $options.bindShow(method);
            });
            
        }
    }

    box.html(HN.tmpl(showTmpl, $options.data));  
    $options.bindShow(method);
  

});

HN.render && (HN.render.option = function($type, $default, $name, $list, $attr,  $box) {
    var 
    options = [],
    attr = $attr || '';
    
    
	if(typeof($box) != "object"){
		var $box=['','',''];
	}
	
	switch($type){
		case 'select':
            options.push('<select name="'+$name+'"  '+ attr +'>');
            for (var i = 0, l = $list.length; i < l; i ++) {
                (function($key, $value) {
                    $key == $default ?
                    options.push('<option selected="selected" value="'+ $key +'">'+ $value +'</option>'): 
                    options.push('<option value="'+ $key +'">'+ $value +'</option>'); 
                })($list[i].id, $list[i].value);
            }
            options.push('</select>');
            break;
		
		case 'radio':case 'checkbox':
			for (var i = 0, l = $list.length; i < l; i ++) {
				(function($key, $value) {
					HN.inArray($key, $default)<0 ?
					options.push($box[0]+'<input name="'+ $name +'" type="'+$type+'" value="'+ $key+'|'+$value+'" '+ attr +' >'+$box[1]+ $value+$box[2]):
					options.push($box[0] +'<input name="'+ $name +'" type="'+$type+'" value="'+ $key+'|'+$value+'" '+ attr +'  checked="true" >'+$box[1]+ $value+$box[2]); 
				})($list[i].id, $list[i].value);
			}
		    break;
		
		default:
	}

    return options.join('');
});
