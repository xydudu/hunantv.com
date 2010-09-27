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
        
        ok && goChat(uin);

    });

    //可以直接聊天的状态
    client.onRaw('SLT_REQ', function($data) {
        
        $('#request-chat').hide();
        $('#send-msg').show();
        $('#status').html('you can chat with ('+ $data.data.user.properties.uin +') now!');

    });

    //监听确定请求
    client.onRaw('SLT_RESPONSE', function($data) {
        HN.debug('SLT_RESPONSE');     
        HN.debug($data);     
        var o = $data.data;
        if (+o.op === 1) {
            //接受了
            HN.debug(o.user.properties.uin +'接受了跟你聊天。。');
            goChat(o.user.properties.uin);
        } else {
            HN.debug(o.op); 
        }
    });
  
    function goChat($uin) {
        HN.debug($uin +'与你聊天中。。');
        $('#request-chat').hide();
        $('#send-msg').show();
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
        }

    };
});
