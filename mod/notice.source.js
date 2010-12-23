//9.30/2010 xydudu CTU
//通知，包括title栏提醒，声音提醒，右下角弹出 

window.HN && (HN.notice = function($doc) {
    var 
    //原始的标题
    originTitle = $doc.title,
    t;

    //闪烁并focus到输入框
    $.fn.shakeElem = function($times) {
        var 
        times = 0,
        elem = $(this),
        offset = elem.offset(),
        args = (arguments.length === 2) ? arguments : ['#B0FAA9', '#fff'],
        shake = function () {
            elem.css('backgroundColor', args[times % 2]);
            times += 1;
            if (times === ($times || 6)) {
                times = 0;
                elem.is('input, textarea') && elem.focus();
                return elem;
            }
            setTimeout(arguments.callee, 100);
            return elem;
        };
        HN.scrollTo(elem);
        return shake();
    };

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
