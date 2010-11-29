//xydudu 7.23/2010 CTU
//common ajax and cross domain ajax
//need HN, jQuery
/*
 * HN.ajax.post('http://somedomain.com', {data:1}, function($data) {
 *       
 * }); 
 *
 * */

/* xPost, xGet base jQuery WNT plugin v1.0 
 * http://noteslog.com/wnt
 * 7.28/2010 xydudu modified
 * cross domain ajax
 * */

window.HN && window.jQuery && (HN.ajax = function() {
     
    HN.debug('HN.ajax is init');    
    
    //defalut datatype is json
    var 
    dataType = 'json',
    container = 'body',
    isrc = "about:blank";

    //tested in Opera 10
    if ($.browser.opera) {
        isrc = "javascript:''";                   //this only works if opera's js debugger is active
        isrc = "http://localhost/wnt/blank.html"; //this only works the first time after a refresh
        isrc = "javascript:<html></html>;".replace(/</g, "&lt;"); //this works
    }

    function parseParams(url) {
        var result = [];
        url.replace(/[?&]([^=]+)=([^&#]*)/g, function( param, name, value ) {
                result.push( '"' + name + '"' + ':' + '"' + value + '"' );
        });
        result = '({' + result.join(',') + '})';
        result = eval(result);
        return result;
    }

    function addForm(action, target, method, data) {
        var 
        form_html = ''
            +'<form'
            +' action="'+ action +'"'
            +' target="'+ target +'"'
            +' method="'+ method +'"'
            +' style="display: none;"'
            +'></form>',
        $form = $(form_html).appendTo(container),
        params = 'GET' == method ? parseParams(action) : {};

        data = $.extend(params, data);
        $.each(data, function(name, value) {
            $('<input type="hidden" name="'+ name +'" value"">')
                    .appendTo($form)
                    .val(value);
        });
        return $form;
    }

    function addIframe(name, src) {
        var 
        iframe_html = ''
            +'<iframe'
            +' name="'+ name +'"'
            +' src="' + src  +'"'
            +' style="display: none;"'
            +'></iframe>',
        $iframe = $(iframe_html).appendTo(container);
        return $iframe;
    }

    function handle_request($method, $url, $data, $ok, $fail) { 
        var 
        iname = 'iframe' + (new Date).getTime(),
        $iframe = addIframe(iname, isrc),
        $form = addForm($url, iname, $method, $data);

        $iframe
            .data('back', false)
            .bind('load', function() {
                if ($iframe.data('back')) {
                    var response = $.parseJSON($iframe[0].contentWindow.name);
                    if ($.isFunction($ok)) {
                        var 
                        callback = +response.err? $fail: $ok;
                        callback(response.data);           
                    }
                    $form.empty().remove();
                    $iframe.empty().remove();
                } else {
                    $iframe.data('back', true);
                    $iframe[0].contentWindow.location = isrc;
                }
            });

        $form[0].submit();
    }

    function a($url, $type, $data, $ok, $fail) {
        var callback;
        $.ajax({
            type: $type,
            url: $url,
            data: $data,
            dataType: dataType,
            success: function($msg){
                HN.debug($msg);
                callback = +$msg.err? $fail: $ok;
                callback($msg.data || $msg.msg);
            },
            error: function($a, $b, $c) {
                $fail($b);
            }
        });
    }
    
    return {
        
        post: function($url, $data, $ok, $fail) {
            HN.debug('HN.ajax.post begin');    
            var fail = $fail || function($msg) {
                HN.debug($msg); 
                //handle error
            };
            a($url, 'POST', $data, $ok, fail);
        },
        
        get: function($url, $data, $ok, $fail) {
            HN.debug('HN.ajax.get begin');    
            var fail = $fail || function($msg) {
                HN.debug($msg); 
                //handle error
            };
            a($url, 'GET', $data, $ok, fail);
        },
        //cross domain post
        //use window.name property 
        xPost: function($url, $data, $ok, $fail) {
            var fail = $fail || function($msg) {
                HN.debug($msg); 
                //handle error
            };
            handle_request('POST', $url, $data || {}, $ok, fail);
        },
            
        //cross domain get
        xGet: function($url, $data, $ok, $fail) {
            var fail = $fail || function($msg) {
                HN.debug($msg); 
                //handle error
            };
            handle_request('GET', $url, $data || {}, $ok, fail);
        }

    };
}());
