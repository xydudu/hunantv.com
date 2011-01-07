//评论 xydudu 8.30/2010 CTU
//comment for everywhere
//need jquery, ajax

//window.HN && window.jQuery && HN.ajax && (
HN.comment = function($uid, $settings) {
        
    var 
    settings = {
        id: 'hn-comment',
        sid: 0,
        url: BASEURL +'photo/comment/',
        project: 'photo',
        theme: 'beta',
        loading: CSSURL +'ui/mangoq/2010v1/images/ico/loading.gif'
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
    box.unbind('click').click(HN.delegate({
        'a.show-reply': function() {
            var 
            that = $(this),
            rbox = $('#reply-'+ that.attr('rel')),
            cls = that.attr('class'),
            rinput = rbox.find('.hn-comment-reply-box'); 

            if (cls.split(' ').length > 1) {
                rinput.find('input.hn-reply-content').val('回复 '+ $('#reply-'+ cls.split('-').pop()).find('.reply-nickname').text() +'：');
            }
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
            HN.face(rbox.find('img.face-trigger'), rbox.find('input.hn-reply-content'));
            return false;
        },

        'input.hn-reply-button': function() {
            var 
            cid = $(this).attr('className').split('-').pop(),
            rinput = $('input.hn-reply-content', '#reply-'+ cid),
            cv = rinput.val();

            if (HN.trim(cv) == '') {
                HN.debug('回复内容不能为空');
                rinput.shakeElem(); 
                return false;
            }else if(HN.trim(cv).length>=140){
				rinput.val(cv.substring(0,128));
				alert('超出140个字符的长度限制，系统已默认截取!');
				rinput.shakeElem();
				return false;
			}
            
            HN.ajax.post(settings.url+ 'reply', {photo_id: settings.sid, comment_id: cid, content: cv}, function($data) {
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
            
        },

        'img.face-trigger': function() {
            var 
            cid = $(this).attr('className').split('-').pop(),
            cbody = $('#reply-'+ cid),
            inputbox = cbody.find('input.hn-reply-content');
            HN.debug('x'); 
            HN.face($(this), inputbox);
            return false; 
        }

    }));

    //分页的事件绑定
    pagebox.unbind('click').click(HN.delegate({
        'a[rel]': function() { 
            getCList($(this).attr('rel'));
            return false;
        },

        'img.prevnext': function() {
            getCList($(this).parent('a').attr('rel'));
            return false;
        }
    }));
    //评论的添加事件
    createbutton.unbind('click').click(createComment);

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
                //pagebox.length && pagebox.html(makePages($data));
                makePages(pagebox, $data);

            } else {
                box.html('<p id="hn-no-comment">还没有评论。</p>');
                pagebox.hide().html('');
            }
        }, function($data) {
            box.html($data);
        });
        
    }
    
    function makePages($box, $data) {
        if ($data.total < 2) 
            return $box.hide();
        var 
        pageNum = 5,
        tmpl = pagetmplbox.html(),
        l = $data.total,
        page = $data.page,
        middle = Math.ceil(pageNum/2),
        data = {
            min: 0,
            max: l,
            page: page,
            total: l
        };
        //如果超过设定长度
        if ($data.total > pageNum) {
            (page - middle) > 0 ?
                (data.min = page - middle):
                (data.min = 0, data.max = pageNum);

            (page + middle) > l ?
                (data.max = l, data.min = l-pageNum):
                ((data.max != pageNum) && (data.max = page + middle));
        }
        $box.html(HN.tmpl(tmpl, data)).show().find('img[over]').hover(function() {
            this.src = [$(this).attr('over'), $(this).attr('over', this.src)][0];    
        });
        return $box;
    }

    function createComment() {
        var
        content = contentbox.val(),
        loadingbox = $('#comment-post-loading'),
        data = {
            'photo_id': settings.sid,
            'content': content
        };
         
        if (HN.trim(content) == '') {
            HN.debug('评论内容不能为空！');    
            //内容为空的处理
            contentbox.shakeElem(); 
            return false;
        }else if(HN.trim(content).length>140){
			contentbox.val(content.substring(0,140));
			alert('超出140个字符的长度限制!');
			contentbox.shakeElem();
			return false;
		}
        
        loadingbox.show();
        HN.ajax.post(settings.url +'create', data, function($data) {

            loadingbox.hide();
            $('#hn-no-comment').remove();
            $data.reply = []; 
            var c = $(HN.tmpl(tmplbox.html(), $data)).hide(); 
            contentbox.val('');
            box.prepend(c.slideDown()); 
            
        }, function($msg) {

            loadingbox.hide();
            contentbox.shakeElem(); 
            //error    
        });
        
    }
    
};
//);


