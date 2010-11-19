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

HN.render.drawOptions = function($default, $list) {
    var 
    options = [];

    for (var i = 0, l = $list.length; i < l; i ++) {
        (function($id, $name) {
            $id == $default ?
            options.push('<option selected="selected" value="'+ $id +'">'+ $name +'</option>'): 
            options.push('<option value="'+ $id +'">'+ $name +'</option>'); 
        })($list[i].id, $list[i].name);
    }
    return options.join('');
}
