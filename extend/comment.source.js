//评论 xydudu 8.30/2010 CTU
//comment for everywhere
//need jquery, ajax

window.HN && window.jQuery && HN.ajax && (HN.comment = function($uid, $settings) {
        
    var 
    settings = {
        id: 'hn-comment',
        sid: 0,
        url: 'http://www.mangoq.com/photo/comment/',
        project: 'photo',
        theme: 'beta',
        loading: 'http://css.mangoq.com/ui/mangoq/2010v1/images/ico/loading.gif'
    },
    page = 1,
    currentSID = 0;
    
    if (HN.isString($settings)) 
        settings.sid = $settings;
    else 
        $.extend(settings, $settings);
    
    var
    box = $('#'+ settings.id),
    tmplbox = $('#'+ settings.id +'-tmpl'),
    pagebox = $('#'+ settings.id +'-pages'),
    pagetmplbox = $('#'+ settings.id +'-pages-tmpl'),
    replytmplbox = $('#'+ settings.id +'-reply-tmpl'),
    createbutton = $('#'+ settings.id +'-create'),
    contentbox = $('#'+ settings.id +'-content');

    //如果没找到box，返回false
    if (!box.length) {
        HN.debug('没有找到相关的HTML'); 
        return false;        
    }
    //没找到模板
    if (!tmplbox.length) {
        HN.debug('没有找到相关的模板'); 
        return false;        
    }

    if (!settings.sid) {
        HN.debug('请传入SID');    
        return false;
    }
    
    //评论内的事件绑定
    box.click(HN.delegate({
        'a.show-reply': function() {
            var 
            rbox = $('#reply-'+ $(this).attr('rel')),
            rinput = rbox.find('.hn-comment-reply-box'); 
            if (rinput.is(':visible')) { 
                focusInput();
                return false;
            }
            if (rbox.is(":visible")) {
                rinput.slideDown(200, focusInput);    
            } else {
                rinput.show();
                rbox.slideDown(200, focusInput);
            }
            
            function focusInput() {
                HN.scrollTo(rinput);
                rinput.find('.hn-reply-content').focus();
            }
            
            return false;
        },

        'input.hn-reply-button': function() {
            var 
            cid = $(this).attr('className').split('-').pop(),
            rinput = $('input.hn-reply-content', '#reply-'+ cid),
            cv = rinput.val();

            if (HN.trim(cv) == '') {
                HN.debug('回复内容不能为空');
                rinput.shakeElem('#728F16', '#fff'); 
                return false;
            }
            
            HN.ajax.post(settings.url+ 'reply', {photo_id: photoID, comment_id: cid, content: cv}, function($data) {
                var ritem = HN.tmpl(replytmplbox.html(), $data);
                $('div.hn-comment-reply-box', '#reply-'+ cid).after(ritem); 
                rinput.val(''); 
            }, function($data) {
                rinput.shakeElem(); 
            });

            return false;
        },

        'a.del-comment': function() {
            var 
            cid = $(this).attr('className').split('-').pop(),
            cbody = $('#comment-'+ cid);
            HN.ajax.post(settings.url +'delcomment', {id: cid}, function($data) {
                //ok 
                cbody.fadeOut(300);
            }, function($data) {
                //error 
            });
        },

        'a.del-reply': function() {
            var 
            cid = $(this).attr('className').split('-').pop(),
            cbody = $('#reply-'+ cid);
            HN.ajax.post(settings.url +'delreply', {id: cid}, function($data) {
                //ok 
                cbody.fadeOut(300);
            }, function($data) {
                //error 
            });   
            
        }

    }));

    //分页的事件绑定
    pagebox.click(HN.delegate({
        'a[rel]': function() { 
            getCList($(this).attr('rel'));
            return false;
        },

        'img.prevnext': function() {
            getCList($(this).parent('a').attr('rel'));
            return false;
        }
    }));

    getCList(page);
    
    //取得comment数据
    function getCList($page) {
        HN.debug($page);
        var data = {
            page: $page,
            id: settings.sid
        };
        box.html('<div style="text-align:center; padding: 10px"><img src="'+ settings.loading +'" /></div>');
        HN.ajax.get(settings.url +'getlist', data, function($data) {
            var
            lists = $data.comment,
            l = lists.length;

            if (l) {
                var 
                html = [],
                tmpl = tmplbox.html();    
                for (var i = 0; i < l; i++) {
                    html.push(HN.tmpl(tmpl, lists[i]));
                }
                box.html(html.join(''));
                pagebox.length && pagebox.html(makePages($data));
                createbutton.unbind('click').click(createComment);

            } else {
                box.html('还没有评论。');
            }
        }, function() {
            box.html('还没有评论。');
        });
        
    }
    
    function makePages($data) {
        var tmpl = pagetmplbox.html();
        return HN.tmpl(tmpl, $data);
    }

    function createComment() {
        var
        content = contentbox.val(),
        data = {
            'photo_id': settings.sid,
            'content': content
        };
         
        if (HN.trim(content) == '') {
            HN.debug('评论内容不能为空！');    
            //内容为空的处理
            contentbox.shakeElem(); 
            return false;
        }
        

        HN.ajax.post(settings.url +'create', data, function($data) {
            $data.reply = []; 
            var c = $(HN.tmpl(tmplbox.html(), $data)).hide(); 
            contentbox.val('');
            box.prepend(c.slideDown()); 
            
        }, function($msg) {
            contentbox.shakeElem(); 
            //error    
        });
        
    }
    
});


