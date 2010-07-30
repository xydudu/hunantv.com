//xydudu 7.28/2010 CTU
//dialog mod
//need HN, jQuery
//need CSS dialog.css

HN && jQuery && (HN.dialog = function(window, undefined) {
    
    var 
    wrapper = head = body = foot = 0,
    options = {
        title: 'This is a dialog',
        body: '',
        foot: ''
    },
    box = [
        '<div id="hn-dialog">',
        '<div id="hn-dialog-head"></div>',
        '<div id="hn-dialog-body"></div>',
        '<div id="hn-dialog-foot"></div>',
        '</div>'
    ].join(''),
    overlay = [
        '<div id="hn-dialog-overlay"></div>',
        '<iframe id="hn-dialog-bgframe" framebroder=0 />'
    ].join('');

    function createBox() {
        !$('#hn-dialog').length && $('body').append(box);   

        wrapper = $('#hn-dialog');
        head = $('#hn-dialog-head');
        body = $('#hn-dialog-body');
        foot = $('#hn-dialog-foot');
    }
    
    return {
        open: function($options) {
            //如果类似 click(open) 会默认传入第一个参数
            ($options && $options.type) && ($options = undefined);
            if ($options === undefined) {
                // 直接调用 HN.dialog.open(); 
                // 打开原来创建的 dialog
                wrapper && wrapper.show();    
            } else {
                //创建html
                wrapper ? wrapper.show() : createBox();

                HN.isString($options) && ($options = {body: $options});
                $.extend(options, $options);

                head.html(options.title);
                body.html(options.body);
            }
            
        },

        close: function() {
            wrapper && wrapper.hide();     
        },

        destroy: function() {
            wrapper && wrapper.remove();     
            wrapper = head = body = foot = 0;
        }
    };
    
}(window));

