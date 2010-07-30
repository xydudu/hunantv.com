//xydudu 7.28/2010 CTU
//dialog mod
//need HN, jQuery
//need CSS dialog.css

HN && jQuery && (HN.dialog = function() {
    
    var 
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

        return [$('#hn-dialog'), $('#hn-dialog-head'), $('#hn-dialog-body'), $('#hn-dialog-foot')];
    }
    
    return {
        open: function($options) {
            
            var
            o = createBox(),
            wrapper = o[0],
            head = o[1],
            body = o[2],
            foot = o[3];

            HN.isString($options) && ($options = {body: $options});
            $.extend(options, $options);

            HN.debug(options);
            body.html(options.body);

            
        },

        close: function() {
            
        },

        destroy: function() {
            
        }
    };
    
}());
