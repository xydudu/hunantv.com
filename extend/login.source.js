// 弹出登陆
// 问题：
// * 如果没必要，就不要用return一个对象来定义一个方法。
// * 域名请用全局变量
// * 获取的DOM用变量缓存起来，如 $('#dialogLoginForm') 出现了多次
// * 一行不要写太长，应该分行写就分行写，便于查看
//window.HN && window.jQuery && ( 
;HN.login = function() {
	//HN.loadCSS('http://css.tazai.com/ui/mangoq/2010v1/css/reg.css');
    var loc = window.location;
	return {
		dialogLoginForm:function($type){
			HN.debug('DialogLoginForm is init');  
			var
			html=[
				'<div class="login-frame">',
				  '<div class="login-divtitle">',
					'<div class="l">注册用户登录</div>',
					'<div class="r"><img class="hn-dialog-close" style="cursor:pointer; padding:5px;" border="0" src="http://css.tazai.com/ui/mangoq/2010v1/images/ico/action_del_default.gif"></div>',
				  '</div>',
				  '<div class="c e-7"></div>',
				  '<div class="c line-dfdfd2"></div>',
				  '<div class="c e-10"></div>',
				  '<form id="dialogLoginForm" method="post" action="http://www.tazai.com/home/user/login">', //form it here
				  '<div class="c login-form">',
					'<dl>',
					  '<dt>邮箱地址：</dt>',
					  '<dd>',
						'<input type="text" alt="email,1||dialog_email_tip" name="username" id="username">',
						'<div id="dialog_email_tip">请填写正确的邮箱帐户！</div>',
						'<span>注册时填写的邮箱地址！</span>',
					  '</dd>',
					'</dl>',
					'<dl>',
					  '<dt>密　　码：</dt>',
					  '<dd>',
						'<input type="password" name="password" id="password" alt="text,1,6,16||dialog_psw_tip">',
						'<div id="dialog_psw_tip">请填写密码，6-16个字符！</div>',
						'<span>密码为6-16个字符！</span>',
					  '</dd>',
					'</dl>',
				  '</div>',
				  '<div class="login-form-checkbox">',
					'<div class="l">',
					  '<input type="checkbox" value="" name="remember" id="remember">',
					  '<input type="hidden" value="" name="ref" id="ref">',
					'</div>',
					'<div class="l">在此电脑上记住我</div>',
				  '</div>',
				  '<div class="login-form-button">',
					'<div class="l">',
					  '<input type="image" src="http://css.tazai.com/ui/mangoq/2010v1/images/button/login.jpg" name="">',
				   '</div>',
					'<div class="l"><a href="http://www.tazai.com/home/user/find_passwd">忘记密码？</a></div>',
				  '</div>',
				  '</form>',
				'</div>'
			].join('');
			
			
			HN.dialog.open({
				'body':html,
				'disableBgClick': true,
				'opacity': 0.1,
				'className': 'f-all w-w378h264',
				'width': 378
			});
			HN.dialog.reSize(354,240);
			$('#ref').val(loc);
			var dialogform=$('#dialogLoginForm');
			//加点点效果
			$('#hn-dialog').hide().fadeIn(200);
			//绑定表单检测
			dialogform.vForm({errBoxClass:'err',inputErrClass:'iw',delayTime:2000},function(){});
			
			if($type){				
				dialogform.submit(function(){
					if(dialogform.xForm({errBoxClass:'err',inputErrClass:'iw',delayTime:2000})){
						var data={username:$('#username').val(),password:$('#password').val(),remember:$('#remember').val()};
						HN.ajax.post('http://www.tazai.com/home/user/ajax_login',data,function($data){
							HN.dialog.close();
							if(!login_uid){login_uid=+$data.msg;}
                            window.location = loc;
						},function(){
							alert('登陆失败,请检查用户名和密码!');
						});
						}
					return false;
				});
			}
		}/*,
		
		isLogin:function($true,$false){
			HN.go('ajax',function(){
				HN.ajax.get('http://js.tazai.com/honey/demos/getlogin.php','',function($data){
					if($data.msg){
						$true.call();
					} else {
						$false.call();
					}
				});
			});
		}*/
    };
};
//);
