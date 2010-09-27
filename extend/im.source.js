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
    pipe = 0;
    
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

    //登陆成功
    client.onRaw('LOGIN', function($data) {

        HN.debug('login');
        HN.debug($data);
        $('#request-chat').show();
        $('#status').html('you are online()');

    });
    //已连接
    client.onRaw('IDENT', function($data) {
        
        HN.debug('ident');
        $('#request-chat').show();
        $('#status').html('you are online('+ $data.data.user.properties.uin +')');

    });
    
    //监听请求聊天    
    client.onRaw('SLT_INVITE', function($data) {
        HN.debug('SLT_INVITE');
        HN.debug($data);
        var 
        //获取向你发送聊天邀请的人
        uin = $data.data.user.properties.uin,
        //是否接受？ 
        ok = confirm(uin +' want to chat with you, chat or not?');
        
        ape.request.send(
            'SLT_RSP', 
            {'uid': uin, 'op': ok ? 1 : 3}
        );
        
        ok && goChat($data.data.user);

    });

    //可以直接聊天的状态
    client.onRaw('SLT_REQ', function($data) {
        
        goChat($data.data.user);
        $('#request-chat').hide();
        $('#send-msg').show();
        
    });

    //监听确定请求
    client.onRaw('SLT_RESPONSE', function($data) {
        HN.debug('SLT_RESPONSE');     
        HN.debug($data);     
        var o = $data.data;
        if (+o.op === 1) {
            //接受了
            HN.debug(o.user.properties.uin +'接受了跟你聊天。。');
            goChat(o.user);
        } else {
            HN.debug(o.op); 
        }
    });
    
    //接收消息
    client.onRaw('SLT_MSG', function($data) {
        var 
        from = $data.data.from,
        msg = $data.data.msg;

        createMsg(from.pubid, msg);
        
    });
  
    function goChat($user) {
        HN.debug($user);
        
        pipe = $user.pubid;
        drawChatBox(pipe);

        $('#status').html('you can chat with ('+ $user.properties.uin +') now!');

        $('#request-chat').hide();
        $('#send-msg').show();
    }
    
    //创建聊天窗口
    function drawChatBox($pubid) {
        var 
        id = 'honey-im-box-'+ $pubid;
        if ($('#'+ id).length) return;
        $('<div />').attr({'id': id, 'className': 'honey-im-box'}).appendTo('body');

    }

    //生成一条信息
    function createMsg($pubid, $msg) {
        $('<p />').html($msg).appendTo('#honey-im-box-'+ $pubid); 
    }

    return {
        
        //连接
        connect: function($ape, $uin) {
            $ape.start({"uin": $uin}); 
        },
        
        //请求聊天
        requestChat: function($ape, $uin) {
            $ape.request.send('SLT_REQ', {"uid": $uin}); 
        },

        //断开聊天
        closeChat: function($ape, $uin) {
            $ape.request.send('SLT_LEFT', {"uid": $uin}); 
        },

        sendMsg: function($ape, $msg) {

            createMsg(pipe, $msg);
            $ape.request.send('SLT_MSG', {'pipe': pipe, 'msg': $msg}); 
        }

    };
});
