// xyudu 11.20/2010
//聊天弹层
//

HN.IMdialog = function($options) {
    
    var 
    //url = 'http://www.mangoq.com/chat/chat/pull',
    url = 'pull.php',
    tmpl = [
        '<div class="chat-frame" id="hn-dialog">',
            '<div class="chat-frame-top">',
                '<div class="l" id="hn-dialog-head"></div>',
                '<div class="r chat-frame-top-x"><a href="#" class="hn-dialog-close">',
                    '<img src="http://css.mangoq.com/ui/mangoq/2010v1/images/ico/x.gif" align="absmiddle" border="0" />',
                '</a></div>',
            '</div>',
            '<div class="chat-frame-mid" id="hn-dialog-body"></div>',
        '</div>' 
    ].join(''),

    dots = {
        'white': 'http://css.mangoq.com/ui/mangoq/2010v1/images/ico/y_white.gif',
        'blue': 'http://css.mangoq.com/ui/mangoq/2010v1/images/ico/y_blue.jpg',
        'yellow': 'http://css.mangoq.com/ui/mangoq/2010v1/images/ico/y_yellow.jpg',
        'purple': 'http://css.mangoq.com/ui/mangoq/2010v1/images/ico/y_purple.jpg'
    },

    wrapTmpl = [
        '<div class="l">',
        '<div class="chat-frame-userinfo">[%=userinfo%]</div>',
        '<div class="chat-frame-chatlog">',
        '<div class="chat-frame-content">[%=chatcontent%]</div>',
        '<div class="chat-frame-status"> Jesmain 正在输入...</div>',
        '</div>',
        '<div class="chat-frame-form">[%=form%]</div>',
        '</div>',
        '<div class="l chat-frame-users">[%=userlist%]</div>'
    ].join(''),

    userItemTmpl = [
        '<div class="chat-frame-users-default">',
        '<div class="chat-frame-users-dot"><img src="http://css.mangoq.com/ui/mangoq/2010v1/images/ico/y_blue.jpg" height="10" width="10" /></div>',
        '<div class="chat-frame-users-name"><a href="#">潇洒小姐</a></div>',
        '<div class="chat-frame-users-del"><a href="#"><img src="http://css.mangoq.com/ui/mangoq/2010v1/images/ico/action_del_default.gif" border="0" height="7" width="8" /></a></div>',
        '<div class="chat-frame-users-face"><a href="#"><img src="http://css.mangoq.com/ui/mangoq/2010v1/images/face/302.jpg" border="0" height="30" width="30" /></a></div>',
        '</div>'
    ].join(''),

    chatContentTmpl = [
        '[% for (var i=0;i<chat_msg.length;i++) {%]',
        '[% if(chat_msg[i].uid==cuid){ %]',
        '<div class="chat-frame-inputs-name-a">[%=user.nickname%]  [%=chat_msg[i].ctime%]</div>',
        '[% } else {%]',
        '<div class="chat-frame-inputs-name-b">[%=chat_user.nickname%]  [%=chat_msg[i].ctime%]</div>',
        '[% } %]',
        '<span>[%=chat_msg[i].msg%]</span>',
        '[% } %]'
    ].join(''),
    
    userinfoTmpl = [
        '<div class="chat-frame-face">',
        '<a href="#"><img src="http://css.mangoq.com/ui/mangoq/2010v1/images/face/803.jpg" border="0" /></a>',
        '</div>',
        '<div class="chat-frame-userinfo-content">',
        '<div class="chat-frame-name"><span>[%=nickname%]</span> &nbsp; &nbsp; [%=age%]岁 [%=live_city_name%]</div>',
        '<div class="chat-frame-action">',
        '<a href="#"><img src="http://css.mangoq.com/ui/mangoq/2010v1/images/button/useraction-addf-default.jpg" border="0" over="http://css.mangoq.com/ui/mangoq/2010v1/images/button/useraction-addf-mouseon.jpg" /></a>',
        '<a href="#"><img src="http://css.mangoq.com/ui/mangoq/2010v1/images/button/useraction-or-default.jpg" border="0" over="http://css.mangoq.com/ui/mangoq/2010v1/images/button/useraction-or-mouseon.jpg" /></a>',
        '</div></div>' 
    ].join(''),
    
    formTmpl = [
        '<div class="chat-frame-icos"><a href="#"><img src="http://css.mangoq.com/ui/mangoq/2010v1/images/ico/face_smile.jpg" border="0" /></a> &nbsp; <a href="#"><img src="http://css.mangoq.com/ui/mangoq/2010v1/images/ico/face_message.jpg" border="0" /></a></div>',
        '<div class="chat-frame-textbox">',
        '<textarea name="message" cols="" rows="" id="message"></textarea>',
        '</div>',
        '<div class="chat-frame-buttom">',
        '<input name="" src="http://css.mangoq.com/ui/mangoq/2010v1/images/button/send-default.gif"  type="image" />',
        '</div>'
    ].join('');

    HN.dialog.alert('loading');
    HN.ajax.get(url, {uid: $options.uid, cuid: $options.cuid}, function($data) {
        HN.dialog.destroy(); 
        HN.debug($data);
        HN.dialog.open({
            'tmpl': tmpl,
            'body': (function() {
                return HN.tmpl(wrapTmpl, {
                    userinfo: HN.tmpl(userinfoTmpl, $data.user), 
                    chatcontent: HN.tmpl(chatContentTmpl, $data), 
                    userlist: userItemTmpl,
                    form: formTmpl
                }); 
            })(),
            'disableBgClick': true,
            'opacity': 0,
            'width': 590
        });        
        
        $('#hn-dialog').find('img[over]').hover(function() {
            this.src = [$(this).attr('over'), $(this).attr('over', this.src)][0];    
        });

        $('.chat-frame-users-default', '#hn-dialog').hover(function() {
            $(this)
                .attr('className', 'chat-frame-users-active')
                .find('.chat-frame-users-dot>img')
                .attr('src', dots.white);
        }, function() {
            $(this)
                .attr('className', 'chat-frame-users-default')
                .find('.chat-frame-users-dot>img')
                .attr('src', dots.blue);    
        });

    });

    return {
        
        open: function() {
            
            
        },

        close: function() {
            
            
        }
        
    };
    
};
