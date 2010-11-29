// 弹出登陆
window.HN && window.jQuery && ( HN.login = function(){
	HN.loadCSS('http://css.mangoq.com/ui/mangoq/2010v1/css/reg.css');
	return {
		dialogLoginForm:function(){
			HN.debug('DialogLoginForm is init');  
			var
			html=[
				'<div class="login-frame">',
				  '<div class="login-divtitle">',
					'<div class="l">注册用户登录</div>',
					'<div class="r"><img class="hn-dialog-close" style="cursor:pointer; padding:5px;" border="0" src="http://css.mangoq.com/ui/mangoq/2010v1/images/ico/action_del_default.gif"></div>',
				  '</div>',
				  '<div class="c e-7"></div>',
				  '<div class="c line-dfdfd2"></div>',
				  '<div class="c e-10"></div>',
				  '<form id="dialogLoginForm" method="post">', //form it here
				  '<div class="c login-form">',
					'<dl>',
					  '<dt>邮箱地址：</dt>',
					  '<dd>',
						'<input type="text" alt="email,1||dialog_email_tip" name="">',
						'<div id="dialog_email_tip">请填写正确的邮箱帐户！</div>',
						'<span>注册时填写的邮箱地址！</span>',
					  '</dd>',
					'</dl>',
					'<dl>',
					  '<dt>密　　码：</dt>',
					  '<dd>',
						'<input type="password" name="" alt="text,1,6,16||dialog_psw_tip">',
						'<div id="dialog_psw_tip">请填写密码，6-16个字符！</div>',
						'<span>密码为6-16伴字符！</span>',
					  '</dd>',
					'</dl>',
				  '</div>',
				  '<div class="login-form-checkbox">',
					'<div class="l">',
					  '<input type="checkbox" value="" name="">',
					'</div>',
					'<div class="l">在此电脑上记住我</div>',
				  '</div>',
				  '<div class="login-form-button">',
					'<div class="l">',
					  '<input type="image" src="http://css.mangoq.com/ui/mangoq/2010v1/images/button/login.jpg" name="">',
				   '</div>',
					'<div class="l"><a href="#">忘记密码？</a></div>',
				  '</div>',
				  '</form>',
				'</div>'
			].join('');			
			
			if($('#hn-dialog').length){
				HN.dialog.reSize(354,240);
				$('#hn-dialog-body').html(html);
				$('#hn-dialog').attr('className', 'f-all w-w378h264').css('width','378px');
				$('.hn-dialog-close').bind('click',(function(){HN.dialog.close();}));
			} else {
				HN.dialog.open({
					'body':html,
					'disableBgClick': true,
					'opacity': 0.1,
					'className': 'f-all w-w378h264',
					'width': 378
				});
			}
			
			//加点点效果
			$('#hn-dialog').hide().fadeIn(200);
			$('#dialogLoginForm').vForm({errBoxClass:'err',inputErrClass:'iw',delayTime:2000},function(){});
		},
		
		isLogin:function($true,$false){
			HN.go('ajax',function(){
				HN.ajax.get('http://js.mangoq.com/honey/demos/getlogin.php','',function($data){
					if($data.msg){
						$true.call();
					} else {
						$false.call();
					}
				})
			});
		}
	}
});