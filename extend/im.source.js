//xydudu 9.19/2010 CTU
//about the IM
//need APE

window.HN && window.APE && (HN.IM = function($fun) {
    
    APE.Config.baseUrl = 'http://js.mangoq.com/APE_JSF';
    APE.Config.domain = 'auto';
    APE.Config.server = 'push.mangoq.com';   
    APE.Config.scripts.push('http://static.weelya.com/weelya_ape/includes/tpl/js/APE_JSF/Build/closureCompiler/apeCoreSession.js');
    
    var 
    client = new APE.Client(),
    ape,
    pipe = 0,
    pipeself,
    chatlists = {},
    notice;
    
    client.load({
        identifier: 'honey-im',
        transport: 2,
        channel: 'test',
        complete: function($ape) {
            ape = $ape; 
            $fun && $fun($ape);
        } 
    });

    //出错
    client.onRaw('ERR', function($data) {
        HN.debug('err');        
        HN.debug($data);        
    });

    //可以直接聊天的状态
    client.onRaw('SLT_REQ', function($data) {
        goChat($data.data.user);
    });
    
    //接收消息
    client.onRaw('SLT_MSG', function($data) {
        var 
        from = $data.data.from,
        msg = $data.data.msg;
        
        HN.debug(from);
        notice = HN.notice.titleMsg(from.properties.uin +'说了些话...');
        if (!pipe || (pipe != from.pubid))
            goChat(from);
        
        createMsg(from.pubid, msg, from.properties.uin);
        
    });
  
    function goChat($user) {
        pipe = $user.pubid;
        chatlists[pipe] = $user;
        drawChatBox(pipe);
        
    }
    
    //创建聊天窗口
    function drawChatBox($pubid) {
        var 
        id = 'honey-im-box-'+ $pubid;
        if ($('#'+ id).length) return;
        
        $('#chat-box').find('.honey-im-box').hide();

        $('<div />').attr({'id': id, 'className': 'honey-im-box'}).appendTo('#chat-box');

        //drawSendForm($pubid);
        $('#send-to').val($pubid);

    }

    //生成一条信息
    function createMsg($pubid, $msg, $name) {
        var name = $name ? $name : '我';
        $name && makeBoxHilight($pubid, $name);
        
        $('<p />').html(name +'说：'+ decodeURIComponent($msg)).attr('className', $name ? 'honey-im-msg-other' : 'honey-im-msg-me').appendTo('#honey-im-box-'+ $pubid); 
        
        $('#chat-box').find('.honey-im-box').hide();
        $('#honey-im-box-'+ $pubid).show();
    }

    function makeBoxHileght($pubid, $uid) {
        //具体要看设计，此处为demo
        $('#chat-list').find('li.chat-now').removeAttr('className');
        $('#u-'+ $uid).attr('className', 'chat-now');
        
    }

    //获得在线列表
    function onlines($fun, $err) {
        var 
        url = 'http://www.mangoq.com/chat/usersol/onlinelist',
        list = [];
        HN.ajax.xGet(url, {}, $fun, $err);
    }

    return {
        
        //连接
        connect: function($ape, $uin, $begin, $over) {
            $ape.start({"uin": $uin}); 
            $begin();
            client.onRaw('LOGIN', function($data) {
                $over($data);
            });
            client.onRaw('IDENT', function($data) {
                pipeself = $data.data.user.pubid;
                $over($data.data.user); 
            });
        },
        
        //请求聊天
        requestChat: function($ape, $user) {
            var uin = $user.uid;
            $ape.request.send('SLT_REQ', {"uid": uin}); 

        },
        
        //断开聊天
        closeChat: function($ape, $uin) {
            $ape.request.send('SLT_LEFT', {"uid": $uin}); 
        },
        
        sendMsg: function($ape, $msg) {
            createMsg(pipe, $msg);
            $ape.request.send('SLT_MSG', {'pipe': pipe, 'msg': $msg}); 
            notice && notice.stop();
        },
        
        updateOnline: onlines,

        getRequest: function($fun) {
            //监听请求聊天    
            client.onRaw('SLT_INVITE', function($data) {
                HN.debug('SLT_INVITE');
                $fun($data);
             });    
        },

        dealRequest: function($uin, $ok) {
            ape.request.send(
                'SLT_RSP', 
                {'uid': $uin, 'op': $ok}
            );
        },

        getReponse: function($fun) {
            //监听确定请求
            client.onRaw('SLT_RESPONSE', $fun);
        },

        readyToChat: goChat

    };
});

