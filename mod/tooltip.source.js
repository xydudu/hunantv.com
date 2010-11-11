//11.5/2010 tooltip
//need jQuery, tmpl
window.HN && window.jQuery && (HN.tooltip = function($elem, $msg, $parentid) {
    
    var 
    tmpl = $('<div />').attr('className', 'msg-window'),
    t, 
    t2,
    isOn = 0;
    
    tmpl.hover(function() {
        isOn = 1;            
    }, function() {
        isOn = 0;            
    });
    
    //position
    tmpl.css('position', 'absolute');

    function show() {
        var 
        msg = HN.isString($msg) ? $msg : $msg.call(this),
        pos = $(this).offset();
        if (!msg || HN.trim(msg) == '') return;
        pos.left += 20;
        pos.top -= 80;
        tmpl.css(pos);
        clearTimeout(t2);
        t = setTimeout(function() {
            tmpl.html(msg).appendTo($parentid || 'body').show();
            clearTimeout(t);
        }, 300);
        
    }

    function hide() {
        //clearTimeout(t);
        t2 = setTimeout(function() {
            isOn ?
                setTimeout(arguments.callee, 300):
                tmpl.hide();

            clearTimeout(t2);
        
        }, 300);
    }
     
    $($elem).hover(show, hide);
    
});
