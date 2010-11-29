/*
 * jQuery WNT plugin v1.0
 * http://noteslog.com/wnt
 * 
 * based on http://www.sitepen.com/blog/2008/07/22/windowname-transport/
 * as explained in http://www.slideshare.net/mehmetakin/ajax-world
 *
 * Copyright (c) 2009 Andrea Ercolino
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-10-04
 */
(function($) {
        
        var container = 'body';
        var isrc = "about:blank";
        
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
                var form_html = ''
                        +'<form'
                        +' action="'+ action +'"'
                        +' target="'+ target +'"'
                        +' method="'+ method +'"'
                        +' style="display: none;"'
                        +'></form>'
                var $form = $(form_html).appendTo(container);
                var params = 'GET' == method ? parseParams(action) : {};
                data = $.extend(params, data);
                $.each(data, function(name, value) {
                        $('<input type="hidden" name="'+ name +'" value"">')
                                .appendTo($form)
                                .val(value)
                        ;
                });
                return $form;
        }
        
        function addIframe(name, src) {
                var iframe_html = ''
                        +'<iframe'
                        +' name="'+ name +'"'
                        +' src="' + src  +'"'
                        +' style="display: none;"'
                        +'></iframe>'
                ;
                var $iframe = $(iframe_html).appendTo(container);
                return $iframe;
        }
        
        function handle_request(method, url, data, handle_response) { 
                var iname = 'iframe' + (new Date).getTime();
                
                var $iframe = addIframe(iname, isrc);
                $iframe
                        .data('back', false)
                        .bind('load', function() {
                            if ($iframe.data('back')) {
                                var response = $iframe[0].contentWindow.name;
                                if ($.isFunction(handle_response)) {
                                        handle_response(response);
                                }
                                $form.empty().remove();
                                $iframe.empty().remove();
                            } else {
                                $iframe.data('back', true);
                                $iframe[0].contentWindow.location = isrc;
                            }
                        });
                
                var $form = addForm(url, iname, method, data);
                $form[0].submit();
        }
        
        $.extend({
                wnt: {
                        'get': function (url, data, callback) {
                                handle_request('GET', url, data || {}, callback);
                        },
                        'post': function (url, data, callback) {
                                handle_request('POST', url, data || {}, callback);
                        }
                }
        });
})(jQuery);
