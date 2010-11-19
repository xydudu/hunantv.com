/*
表单检测

◇使用方法　分两步◇

㈠在对应的表单元素中 加入相应的参数

利用表单属性（ALT）控制参数，格式:argument1|argument2|[argument3|argument4|Msg|MsgBox]
argument1:
		text 		文本
		number		数字
		chinese		中文
		mobile	 	手机
		tel			电话
		idcard 		身份证
		...可根据正则扩展
		
		checkbox	checkbox独用
		password    此类型为比较密码类型,argument2 必须为 比较对象的 ID
		fun         外挂 函数 检测，此时  argument3 必填，值为函数名  如  检测email    alt="fun,ajaxEmail" ,函数在错误时返回原因，正确时返回1
		
argument2:
		0  			表示 表单可不填,但要是填写了就必须满足参数一[argument1]的类型检测
		1  			表示 必填,且如果存在  argument3,argument4时  长度 必须满足两个参数之间
		2  			表示 必填,且如果存在  argument3,argument4时  大小 必须满足两个参数之间
		3  			错误信息 针对textarea等大的控件，将信息浮动显示在控件的中间	

argument3: 			数字,配合argument2   

argument4:			数字,配合argument2

Msg:				文本,用于默认出错提示。如 <input alt="text,1|错误内容|errbox">  不符合条件后将在检测对象的正后方显示 "错误内容"
MsgBox:				id,用于自定义错误。如<div id='errbox'>err</div>   <input alt="text,1|错误|errbox">  出错后将显示<div id='errbox'>err</div>


㈡在页面加载后执行如下语句，参数说明见下
$('#formid').vForm({msgBoxClass: 'errClass',errBoxPrefixes:'errMsg_',inputErrClass:'input_warring'});

msgBoxClass: 'errClass',  //默认错误消息框样式
inputErrClass:'input_warring'  //错误 表单样式
*/

jQuery.fn.extend({
	vForm:function(options,callback){
		var form=$(this),
		defaults={
			msgBoxClass: 'errClass',  
			inputErrClass:'input_warring'
		};
		var options = $.extend(defaults, options);
		form.submit(function(){if(verify('submit')){callback(); return true;}else{return false;}; });
		verify();
		function verify($s){			
			var
			re=true,
			cursor=false,
			objs=form.find('input[alt]:visible,textarea[alt]:visible,select[alt]:visible,checkbox[alt]:visible');
			objs.each(function(){
				var
				obj=$(this),
				arguments=obj.attr('alt'),
				v,
				len,
				i=objs.index(obj),
				user_define_errbox,
				m;
				if(arguments==null){
					
				}else{
					v=arguments.split('|');
					m=v[1];
					v[2]?user_define_errbox=v[2]:user_define_errbox=false;
					v=v[0];					
				}
				if($s=='submit'){
					re=re&checkIpunt(v,m);
				}else{
					obj.unbind('blur').blur(function(){re=re+' '+checkIpunt(v,m)});
				}
			
				function checkIpunt($v, $msg) {
					var
					reg_string='',
					val=obj.val(),
					v = $v.split(',');
					
					if(obj.val()==null){var len=0}else{var len=obj.val().replace(/[^\x00-\xff]/g,"**").length}
					
					switch (v[0]) {
						case 'text':
						break;
						case 'email':
						reg_string = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
						break;
						case 'tel':
						reg_string = '(^\([0-9]{3,4}-\)?[0-9]{7,8}$)';
						break;
						case 'mobile':
						reg_string = '(^1[358]{1}[0-9]{9}$)';
						break;
						case 'chinese':
						reg_string = '(^[\u4e00-\u9fa5]+$)';
						break;
						case 'number':
						reg_string = '(^[0-9]+$)';
						break;
						case 'idCard':
						reg_string = '((^\d{15}$)|(^\d{17}([0-9]|X)$))';
						break;
						case 'checkbox':
						if ((v[1] == 1) & (!obj.attr("checked"))) {
							return showErr(obj, m);
						} else {
							return closeErr(obj, i);					
						}
						break;
						case 'password':
						if (obj.val() != $('#' + v[1]).val()) {
							return showErr(obj, m);					
						} else {
							return closeErr(obj, i);					
						}
						break;
						case 'fun':
						if (v[1] != '') {
							var result = eval(v[1])(); 
							if (result == 1) {
								return closeErr(obj, i);					
							} else {
								return showErr(obj, result);
							}					
						}
						break;					
					}
					
					return checkStr(reg_string);
					
					function checkStr($reg_str){
						var reg = new RegExp($reg_str),
							result = reg.test(obj.val());
						if (v[1] == 0) {
							if (obj.val() != '' & (len < v[2] || len > v[3] || !result)) {
								return showErr(obj, m);				
							} else {
								return closeErr(obj, i);				
							}
						} else if (v[1] == 1) {
							if (obj.val()==null||obj.val() == '' || !result || len < v[2] || len > v[3]) {
								return showErr(obj, m);
							} else {
								return closeErr(obj, i);				
							}
						}else if (v[1] == 2) {
							if (val==null || val == '' || !result || val< parseInt(v[2]) || val> parseInt(v[3])) {
								
								return showErr(obj, m);
							} else {
								return closeErr(obj, i);				
							}
						} else if (v[1] == 3) {
							if (obj.val()==null||obj.val() == '' || !result || len < v[2] || len > v[3]) {
								return showErr(obj, m ,1);
							} else {
								return closeErr(obj, i ,1);				
							}
						} else {
							return closeErr(obj, i ,1);		
						}
					}
				}
				
				function showErr($taget, $msg, $middle) {
					if(user_define_errbox){
						if(options.delayTime){
							$('#'+user_define_errbox).show().delay(options.delayTime).fadeOut(400);
						}else{
							$('#'+user_define_errbox).show();
						}
					} else {
						var offset = $taget.offset();
						if($msg){
							var current_errbox=$('#'+form.attr('id')+'_err_' + i);
							if(current_errbox.length){current_errbox.html($msg);}
							if(!current_errbox.length){
								msgbox = $('<div></div>').html($msg);
								msgbox.appendTo('body').hide();
								msgbox.attr('id', form.attr('id')+'_err_' + i);
								msgbox.css({position: 'absolute',lineHeight: '22px'});
								if($middle==1){
									msgbox.css({								
										left: offset.left + $taget.width()/2 - (msgbox.width()/2) + 'px',
										top: offset.top +$taget.height()/2 - 10 + 'px'
									});
									obj.unbind('click').bind('click',function(){			  
										$('#'+form.attr('id')+'_err_' + i).fadeOut(1000,function(){
											current_errbox.remove();
										});
									});
								}else{
									msgbox.css({
										position: 'absolute',
										left: offset.left + $taget.width() + 10 + 'px',
										top: offset.top + 'px'
									});
								}
								msgbox.addClass(options.msgBoxClass);
								msgbox.show();							
							}
						}
					}
					$taget.addClass(options.inputErrClass);
					if(cursor==false){
						$taget.focus();
						$taget.select();
						cursor=true;
					}
					return false;
				}
				
				function closeErr($taget,$i) {
					var current_errbox=$('#'+form.attr('id')+'_err_' + i);
					if(user_define_errbox){
						$('#'+user_define_errbox).hide();
					} else {
						current_errbox.remove();
					}
					$taget.removeClass(options.inputErrClass);
					return true;
				}
			});	
			return Boolean(re);			
		}
	}
});
