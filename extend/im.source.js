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
    pipe = 0;
    
    client.load({
        identifier: 'honey-im',
        transport: 2,
        channel: 'test',
        complete: $fun 
    });

    //出错
    client.onRaw('ERR', function($data) {
        HN.debug('err');        
        HN.debug($data);        
    });

    //连接返回
    client.onRaw('login', function($data) {
        HN.debug('login')
        HN.debug($data)
    });
    
    //监听请求聊天    
    client.onRaw('SLT_INVITE', function($data) {
        HN.debug('SLT_INVITE');
        HN.debug($data);
    });
  
    return {
        
        //连接
        connect: function($ape, $uin) {

            $ape.start({"uin": $uin}); 
            
        },
        
        //请求聊天
        requestChat: function($ape, $uin) {

            $ape.request.send('SLT_REQ', {"uid": $uin}); 

        }
        
    };
});
