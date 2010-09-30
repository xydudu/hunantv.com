//9.30/2010 xydudu CTU
//通知，包括title栏提醒，声音提醒，右下角弹出

window.HN && (HN.notice = function($doc) {
    var 
    //原始的标题
    originTitle = $doc.title,
    t;
    return {
        
        //title栏的提醒
        //$msg: 显示消息内容
        //$sound: 是否提示声音
        titleMsg: function($msg, $sound) {
            if (t)
                clearInterval(t);
            var i = 0;             
            t = setInterval(function() {
                $doc.title = i % 2 ? '['+ $msg +']' : originTitle;
                i ++;    
            }, 500);

            return {
                stop: function() {
                    clearInterval(t);
                    $doc.title = originTitle;                    
                }  
            };
        }
        
    };
    
}(window.document));
