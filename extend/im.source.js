//xydudu 9.19/2010 CTU
//about the IM
//need APE

window.HN && window.APE && (HN.IM = (function() {
    
    APE.Config.baseUrl = HN.config.url.js +'APE_JSF';
    APE.Config.domain = 'auto';
    APE.Config.server = 'push.tazai.com:6969';   
    APE.Config.scripts.push(HN.config.url.js +'lib/ape.core.min.js');
    
    var 
    client = new APE.Client(),
    lists = {},
    userListBox,
    CUID,
    ape,
    win,
    notice;

    client.load({
        identifier: 'honey-im',
        transport: 2,
        complete: function($ape) {
            ape = $ape; 
            ape.inDialog = $('#hn-im-dialogbox').length>0;
            ape.inDialog && (client.loading = showLoading());
            //连接登录
            if (!window.UID) {
                HN.debug('where is the uid? baby');    
                alert('此页没有设定UID, APE不能登录，请做此页面的人改改！');
                ape.inDialog && closeWindow();
                return;
            }
                
            HN.debug('IM connecting..');
            
            connect(UID, function($data) {
                   
                HN.debug('IM connect OK');
                if (ape.inDialog) {
                    ape.request.send('MGQ_IMCHAT', {}, true);
                    client.inited && client.loading.close(); 
                } 
                client.connected = true;
                
            });

        } 
    });

    function showLoading() {
        
        var
        box = $('#im-loading'),
        img = $('#im-loading-img');

        if (!box.length) {
            var 
            doc = $(window),
            css = {
                height: doc.height(),
                width: doc.width(),
                opacity: 0.5
            };
            box = $('<div />').attr('id', 'im-loading').appendTo('body');
            img = $('<img />').attr({id: 'im-loading-img', src: CSSURL +'ui/mangoq/2010v1/images/ico/loading2.gif'}).appendTo('body');
            box.css(css).show();
        }

        return {
            close: function() {
                box.hide(); 
                img.hide();
            },

            show: function() {
                box.show();    
                img.show(); 
            }
        };

    }

    function connect($uid, $fun) {
        if (!ape) return;

        ape.start({"uin": ''+$uid, "samkey": HN.cookie.get('samkey')}); 

        client.onRaw('LOGIN', function($data) {
            //$fun($data);
        });

        client.onRaw('IDENT', function($data) {
            $fun($data.data.user); 
        });
    }

    //出错
    client.onRaw('ERR', function($data) {
        HN.debug('err');        
        HN.debug($data);        
    });

    client.onRaw('MGQ_ADDCHAT', function($data) {
        HN.debug('get ADD');
        window.location.hash = 'cuid='+ $data.data.uin;     
    });

    client.onRaw('MGQ_CHATLEFT', function($data) {
        HN.cookie.remove('imopen', '', '/'); 
        win = null;
    });

    //接收消息
    client.onRaw('MGQ_MSG', function($data) {

        var 
        cuid = $data.data.from.properties.uin,
        msg = $data.data.msg,
        doCreateMsg = function($nickname, $userItem) {
            var 
            cuser = [],
            i = 0,
            originTitle = window.document.title;
            (function(){
                if (cuid == CUID && $('body').attr('id') == 'focused') {
                    window.document.title = originTitle; //notice.stop();
                    return;   
                }
                window.document.title = i % 2 ? originTitle : '['+ $nickname +' 来消息了]';
                i ++;
                setTimeout(arguments.callee, 500);
            })();

            (!$userItem.length) && 
                (cuser.push(lists[cuid]), 
                $userItem = userListBox.insertOne(cuser));

            shakeHead($userItem, cuid);

        };
        if (ape.inDialog) {

            var 
            nickname = getName(cuid),
            userItem = $('#user-'+ cuid); 

            nickname ? 
                (doCreateMsg(nickname, userItem),
                createMsg(cuid, {msg: decodeURIComponent(msg), ctime: formtTime($data.time), uid: cuid, cuid: cuid})) : 
                pullUserInfo(cuid, function($data) {

                    lists[cuid] = $data.chat_user; 
                    lists[cuid].chat_msg = $data.chat_msg; 
                    lists[cuid].relation = $data.relation; 
                    lists[cuid].relation2 = $data.relation2; 
                    //聊天记录
                    !lists[cuid].inited && createMsg(cuid, $data.chat_msg);
                    lists[cuid].inited = 1; 
                    doCreateMsg($data.chat_user.nickname, userItem); 

                }, true); 

        } else {
            //不在弹窗页    
            var 
            numbox = $('#im-msg-num'),
            abox = numbox.find('a'),
            originNum = +abox.text(),
            num = originNum ? originNum+1 : 1;
            abox.html(num);
            numbox.show(); 

        }
        
    });

    function getName($uid) {
         
        if( lists[$uid] && lists[$uid].nickname ) 
            return lists[$uid].nickname;
        else 
            return false;
    }

    //跳头
    function shakeHead($userItem, $cuid) {
        var 
        n = 0,
        img = $userItem.find('.chat-frame-users-face img');
        (function() {
            if ($cuid == CUID) {
                img.css('margin', 0);
                return;
            } 
            img.css('marginRight', (n % 3) - 1);
            img.css('marginTop', (n % 3)==1?1:0);
            n ++;
            setTimeout(arguments.callee, 150);
        })();    
    }

    //更新在线列表
    function updateList($data, $cuid) {
        var 
        box = $('#user-list-box'),
        loading = [],
        shakeID = [];

        if ($data.length) {
            box.html(HN.tmpl('userlisttmpl', {users: $data, shakeID: shakeID})).unbind('click').click(HN.delegate({
                'div.chat-frame-users-default, div.chat-frame-users-name>a, div.chat-frame-users-face img': function() {
                    var id = $(this).attr('id').split('-')[1];
                    focusUser(id);
                    return false;
                }
            }));

            while(shakeID.length) {
                var cuid = shakeID.shift();
                shakeHead($('#user-'+ cuid), cuid);    
            }
        }  

        return {
          
            insertOne: function($user) {
                
                var html = HN.tmpl('userlisttmpl', {users: $user}); 
                box.append(html);
                //新加入。。效果？
                return $('#user-'+ $user[0].uid);
                
            }
            
        };
    }

    function focusUser($uid) {
        var
        box = $('#user-'+ $uid),
        others = box.parent().find('.chat-frame-users-active');

        box.data('dot', box.find('.chat-frame-users-dot>img').attr('src'));
        
        others.each(function($index) {
            var 
            that = $(this); 
            that.data('dot') &&
            setAttr(that, 'chat-frame-users-default', that.data('dot'), CSSURL +'ui/mangoq/2010v1/images/ico/action_del_default.gif'); 
        });
        
        setAttr(box, 'chat-frame-users-active', CSSURL +'ui/mangoq/2010v1/images/ico/y_white.gif', CSSURL +'ui/mangoq/2010v1/images/ico/action_del_active.gif');

        //change
        CUID = $uid;
        $('#cuid').val($uid);
        showUserInfo($uid);
        showUserMsgBox($uid);

        function setAttr($box, $class, $dot, $del) {
            $box.attr('className', $class);
            $box.find('.chat-frame-users-dot>img').attr('src', $dot);
            $box.find('.chat-frame-users-del>img').attr('src', $del);
        }

    }
    
    function showUserInfo($uid) {
        var 
        box = $('#user-info'),
        bindOver = function($lists) {

            if ($lists.relation.is_black) {
                showBlockBox($uid);  
                $('#im-form').hide();
            } else {
                $('#im-isblock-box').hide();
                $('#im-form').show();
            } 

            
            box.html(HN.tmpl('userinfotmpl', $lists));
            !$lists.inited && createMsg($uid, $lists.chat_msg);
            $lists.inited = 1; 

            !box.status && box.find('img[over]').hover(function() {
                this.src = [$(this).attr('over'), $(this).attr('over', this.src)][0];    
            });
            box.status = true;    
        };
        
        if (lists[$uid]) {
            bindOver(lists[$uid]);
            //聊天记录
            
        } else pullUserInfo($uid, function($data) {
            
            lists[$uid] = $data.chat_user; 
            lists[$uid].chat_msg = $data.chat_msg; 
            lists[$uid].relation = $data.relation;
            bindOver(lists[$uid]);
            
        });

    }

    function pullUserInfo($uid, $fun, $hideloading) {
        client.loading && client.loading.show(); 
        $hideloading && client.loading.close();
        HN.ajax.get(BASEURL +'chat/chat/chat_msg', {cuid: $uid}, function($data) {
            client.loading && client.loading.close();    
            $fun($data); 
        }, function() {/* get info fial */});
        
    }

    function createInput($cuid) {
        var 
        box = $('#im-form');
        
        box.html(HN.tmpl('chatformtmpl', {cuid: $cuid}));
        var 
        bsub = $('#im-submit'),
        random = $('#random-msg'),
        textarea = $('#message');

        bsub.hover(function() {
            this.src = [$(this).attr('over'), $(this).attr('over', this.src)][0];    
        }).click(sendMsg);

        random.click(function() {
            textarea.val(RANDOMMSG[parseInt(HN.random(0, RANDOMMSG.length-1))]);
        });

        //HN.face($('#face-trigger'), textarea);
        $('#face-trigger').click(showFace);
        
        document.onkeydown = function($e){
            var e = window.event ? window.event : $e;
            if (e.keyCode == 13) {
                bsub.trigger('click');
                return false;
            }
        };

    }

    function showFace() {
        var 
        that = $(this),
        i = 18,
        facebox = $('#im-face-box');
        
        if (!facebox.length) {
            facebox = $('<span />').attr({id: 'im-face-box'}).css('marginRight', 10).insertBefore(that);
            while (i>0) {
                facebox.append('<img src="'+ CSSURL +'ui/mangoq/2010v1/images/ico/face_'+ i +'.jpg" title="face_'+ i +'" border="0" />');
                i --;
            }
        } else {
            facebox.remove();    
        }

        facebox.children('img').click(function() {
            facebox.remove();
            var 
            textarea = document.getElementById('message'), 
            rangeData = getCursorPosition(textarea), 
            text = ' {'+ this.title +'} ';
            var oValue, nValue, oR, sR, nStart, nEnd, st;
            setCursorPosition(textarea, rangeData);
            
            if (textarea.setSelectionRange) { // W3C
                oValue = textarea.value;
                nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
                nStart = nEnd = rangeData.start + text.length;
                st = textarea.scrollTop;
                textarea.value = nValue;
                // Fixbug:
                // After textarea.values = nValue, scrollTop value to 0
                if(textarea.scrollTop != st) {
                    textarea.scrollTop = st;
                }
                textarea.setSelectionRange(nStart, nEnd);
            } else if (textarea.createTextRange) { // IE
                sR = document.selection.createRange();
                sR.text = text;
                sR.setEndPoint('StartToEnd', sR);
                sR.select();
            }
            
        });
        
    } 

    /**
    * setCursorPosition Method
    *
    * Created by Blank Zheng on 2010/11/12.
    * Copyright (c) 2010 PlanABC.net. All rights reserved.
    *
    * The copyrights embodied in the content of this file are licensed under the BSD (revised) open source license.
    */
    function setCursorPosition(textarea, rangeData) {
        if(!rangeData) {
            alert("You must get cursor position first.");
        }
        if (textarea.setSelectionRange) { // W3C
            textarea.focus();
            textarea.setSelectionRange(rangeData.start, rangeData.end);
        } else if (textarea.createTextRange) { // IE
            var oR = textarea.createTextRange();
            // Fixbug :
            // In IE, if cursor position at the end of textarea, the setCursorPosition function don't work
            if(textarea.value.length === rangeData.start) {
                oR.collapse(false);
                oR.select();
            } else {
                oR.moveToBookmark(rangeData.bookmark);
                oR.select();
            }
        }
    }
    

    /**
    * getCursorPosition Method
    *
    * Created by Blank Zheng on 2010/11/12.
    * Copyright (c) 2010 PlanABC.net. All rights reserved.
    *
    * The copyrights embodied in the content of this file are licensed under the BSD (revised) open source license.
    */
    function getCursorPosition(textarea) {
        var rangeData = {text: "", start: 0, end: 0 };
            textarea.focus();
        if (textarea.setSelectionRange) { // W3C
            rangeData.start= textarea.selectionStart;
            rangeData.end = textarea.selectionEnd;
            rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end): "";
        } else if (document.selection) { // IE
            var i,
                oS = document.selection.createRange(),
                // Don't: oR = textarea.createTextRange()
                oR = document.body.createTextRange();
            oR.moveToElementText(textarea);

            rangeData.text = oS.text;
            rangeData.bookmark = oS.getBookmark();

            // object.moveStart(sUnit [, iCount])
            // Return Value: Integer that returns the number of units moved.
            for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i ++) {
                // Why? You can alert(textarea.value.length)
                if (textarea.value.charAt(i) == '\n') {
                    i ++;
                }
            }
            rangeData.start = i;
            rangeData.end = rangeData.text.length + rangeData.start;
        }

        return rangeData;
    }

    function sendMsg() {
        var 
        msgbox = $('#message'),
        cuid = $('#cuid').val(),
        v = msgbox.val();

        if (HN.trim(v) === '') {
            HN.debug('内容不能为空');
            msgbox.shakeElem(); 
            return false;
        }

        if (!+cuid) {
            HN.debug('where is cuid?');
            return false;
        }
        
        if (!ape) {
            HN.debug('ape not ready!');
            return false;    
        }
        msgbox.val('');
        createMsg(cuid, {msg: v, ctime: formtTime(), uid: UID, cuid: cuid});
        if (lists[cuid] && lists[cuid].relation2 && lists[cuid].relation2.is_black) return false; 

        ape.request.send('MGQ_SEND', {'uin': ''+cuid, 'msg': v}, true);
        return false;    
    }
    
    function formtTime($time) {
        var tm;
        if ($time) {
            var 
            dt = new Date($time*1000),
            y = dt.getFullYear(), 
            m = dt.getMonth()+1, 
            d = dt.getDate(),
            h = dt.getHours(), 
            mt = dt.getMinutes(), 
            s = dt.getSeconds();
            tm = h+":"+mt+":"+s;
            //tm = y+"-"+m+"-"+d+" "+h+":"+mt+":"+s;
        } else {
            tm = Date().match(/\d{1,2}:\d{1,2}:\d{1,2}/)[0];
        } 
        return tm;
    }

    function createMsg($cuid, $data) {
        var 
        msgtmpl = [
            '<div class="chat-frame-inputs-name-[%=cls%]">[%=who%]  [%=ctime%]</div>',
            '<span>[%=msg%]</span>'
        ].join(''),
        msgs = [],
        box = document.getElementById('msg-list');

        if ($data.msg) {
            msgs.push($data);
        } else {
            msgs = $data;
        }

        inbox = showUserMsgBox($cuid);
        
        $.each(msgs, function($k, $v) {
            $v.cls = ($cuid == $v.cuid) ? 'a' : 'b';
            $v.msg = parseMsg(decodeURIComponent($v.msg));
            $v.who = (UID == $v.uid) ? '我' : getName($v.uid);
            inbox.append(HN.tmpl(msgtmpl, $v));
            box.scrollTop = box.scrollHeight;
        });

    }

    function parseMsg($str) {
        $str=$str.replace(/\{face_([0-9]|1[0-8])\}/g, '<img onerror="this.src=\''+ CSSURL +'ui\/mangoq\/2010v1\/images\/ico\/face_2.jpg\';" src="'+ CSSURL +'ui/mangoq/2010v1/images/ico/face_$1.jpg"/>');
        return $str;
    }

    function showUserMsgBox($cuid) {
        var 
        box = document.getElementById('msg-list'),
        inbox = $('#msg-list-'+ $cuid);
        
        if (!inbox.length)
            inbox = $('<div class="chat-frame-content" id="msg-list-'+ $cuid +'"></div>').appendTo('#msg-list'); 

        inbox.hide();
        if (CUID == $cuid) {
            $('.chat-frame-content').hide();
            inbox.show();
            box.scrollTop = box.scrollHeight;
        }

        return inbox;
    }

    function showBlockBox($cuid) {
        var box = $('#im-isblock-box');
        box.find('input').attr('className', 'hn-action-disblock-im c-'+ $cuid);
        box.show(); 
    }
    
    function closeWindow() {
        //close
        //要不要提示？
        try {
            win.close();    
        } catch($err) {
            window.close(); 
        }
        HN.cookie.remove('imopen', '', '/'); 
        win = null;
    } 

    $(window).bind('beforeunload',function(){
        HN.cookie.remove('imopen', '', '/'); 
        win = null;
    });
    

    return {
        
        init: function($cuid, $fun) {
            if ($('body').attr('id') != 'focused' && HN.cookie.get('imopen')) {
                var  
                i = 0,
                originTitle = window.document.title;
                (function(){
                    if ($('body').attr('id') == 'focused') {
                        window.document.title = originTitle; //notice.stop();
                        return;   
                    }
                    window.document.title = i % 2 ? originTitle : '可以聊天啦，快来快来！！';
                    i ++;
                    setTimeout(arguments.callee, 500);
                })();
            }
            self.focus();

            createInput($cuid);
            HN.ajax.get(BASEURL +'chat/chat/pull', {uid: UID, cuid: $cuid}, function($data) {
                //判断是否有头像
                if (HN.isString($data.user.avatar_key) && $data.user.avatar_key != '') {
                    lists[$cuid] = $data.chat_user;
                    lists[$cuid].chat_msg = $data.chat_msg;
                    lists[$cuid].relation = $data.relation;
                    lists[$cuid].relation2 = $data.relation2;
                    userListBox = updateList($data.user_list, $cuid);
                    focusUser($cuid); 
                } else {
                    //no avatar 
                    HN.debug('没头像');
                }
                
                client.connected && client.loading && client.loading.close();
                HN.cookie.set('imopen', 1, '', '', '/');

            }, function() { 
                
                HN.debug('取数据时出错！');
                //closeWindow();
                
            });             
        },

        updateUserInfo: function($cuid) {
            pullUserInfo($cuid, function($data) {

                lists[$cuid].relation = $data.relation;
                lists[$cuid].relation2 = $data.relation2;
                
            });            
        },

        blockUser: function($cuid) {
            showBlockBox($cuid);
            $('#im-form').hide();
            lists[$cuid].relation.is_black = true;
        },

        disblockUser: function($cuid) {
            
            $('#im-isblock-box').hide();
            $('#im-form').show();
             
            lists[$cuid].relation.is_black = false;
            
        },

        removeUser: function($cuid) {
             
            if (CUID == $cuid) {
                //当前
                $('div.chat-frame-users-default').length ?
                    window.location.hash = 'cuid='+ $('div.chat-frame-users-default').attr('id').split('-')[1]:
                    //focusUser($('div.chat-frame-users-default').attr('id').split('-')[1]):
                    closeWindow();
            } 
            
            //么效果？
            $('#user-'+ $cuid).remove();
               
        },
        
        open: function() {

            if (!ape) {
                alert('你还没登录到聊天系统中，请稍等！！！');    
                return false;
            }
            var 
            url = this.href,
            pop = function($url, $target) {
                var newwin = window.open($url, $target, 'height=500, width=600, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes');
                return newwin;
            };
            
            if (HN.cookie.get('imopen')) {
                 
                ape.request.send('MGQ_ADDCHAT', {uin: url.split('=')[1]}, true);

            } else {
                try {
                    win.location = this.href;
                } catch($err) {
                    win = pop(url, this.target);
                }
                window.focus && win.focus();
            }
            return false;
        },

        close: closeWindow

    };
})());

