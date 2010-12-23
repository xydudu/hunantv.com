// xyudu 11.20/2010
//聊天弹层 
//
HN.IMdialog = function() {
    var 
    win,
    pop = function($url, $target) {
        win = window.open($url, $target, 'height=500, width=600');
        if (window.focus) {win.focus()}
        return win;
    };
    
    HN.debug(this.target);
    pop(this.href, this.target);
    
};
