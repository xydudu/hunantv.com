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
        
        edit: function() {
            
            box.html(HN.tmpl(editTmpl, $options.data));
            $options.bindEdit(method);
            
        },

        post: function() {
            var 
            form = box.find('form'),
            url = form.attr('action'),
            params = form.serialize();
                
            HN.ajax.post(url, params, function($data) {
                $options.data = $data; 
                box.html(HN.tmpl(showTmpl, $data));
                $options.bindShow(method);
                
            });
            
        }
    }

    box.html(HN.tmpl(showTmpl, $options.data));  
    $options.bindShow(method);
  

});

function in_array($str,$arr){
	for(i=0;i<$arr.length;i++){
		if($arr[i] == $str){
			return true;
		}
	}
	return false;
}

HN.render.option = function($type, $default, $name, $list) {
    var 
    options = [];
	switch($type){
		case 'select':
		options.push('<select name="'+$name+'">');
		for (var i = 0, l = $list.length; i < l; i ++) {
			(function($key, $value) {
				$key == $default ?
				options.push('<option selected="selected" value="'+ $key +'">'+ $value +'</option>'): 
				options.push('<option value="'+ $key +'">'+ $value +'</option>'); 
			})($list[i].id, $list[i].value);
		}
		options.push('</select>');
		break;
		
		case 'checkbox':
		for (var i = 0, l = $list.length; i < l; i ++) {
			(function($key, $value) {
				in_array($key,$default) ?
				options.push('<input name="'+ $name +'" type="checkbox" value="'+ $key+'|'+$value+'" checked>'+ $value): 
				options.push('<input name="'+ $name +'" type="checkbox" value="'+ $key+'|'+$value+'">'+ $value); 
			})($list[i].id, $list[i].value);
		}
		break;
		
		case 'radio':
		for (var i = 0, l = $list.length; i < l; i ++) {
			(function($key, $value) {
				$key == $default ?
				options.push('<input name="'+ $name +'" type="radio" value="'+ $key+'" checked>'+ $value): 
				options.push('<input name="'+ $name +'" type="radio" value="'+ $key+'">'+ $value); 
			})($list[i].id, $list[i].value);
		}
		break;
		
		default:
	}
    return options.join('');
}
