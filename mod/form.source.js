/*
�������

��ʹ�÷�������������

���ڶ�Ӧ�ı���Ԫ���� ������Ӧ�Ĳ���

���ñ������ԣ�ALT�����Ʋ�������ʽ:argument1|argument2|[argument3|argument4|Msg|MsgBox]
argument1:
		text 		�ı�
		number		����
		chinese		����
		mobile	 	�ֻ�
		tel			�绰
		idcard 		����֤
		...�ɸ���������չ
		
		checkbox	checkbox����
		password    ������Ϊ�Ƚ���������,argument2 ����Ϊ �Ƚ϶���� ID
		fun         ��� ���� ��⣬��ʱ  argument3 ���ֵΪ������  ��  ���email    alt="fun,ajaxEmail" ,�����ڴ���ʱ����ԭ����ȷʱ����1
		
argument2:
		0  			��ʾ �����ɲ���,��Ҫ����д�˾ͱ����������һ[argument1]�����ͼ��
		1  			��ʾ ����,���������  argument3,argument4ʱ  ���� ����������������֮��
		2  			��ʾ ����,���������  argument3,argument4ʱ  ��С ����������������֮��
		3  			������Ϣ ���textarea�ȴ�Ŀؼ�������Ϣ������ʾ�ڿؼ����м�	

argument3: 			����,���argument2   

argument4:			����,���argument2

Msg:				�ı�,����Ĭ�ϳ�����ʾ���� <input alt="text,1|��������|errbox">  �������������ڼ������������ʾ "��������"
MsgBox:				id,�����Զ��������<div id='errbox'>err</div>   <input alt="text,1|����|errbox">  ��������ʾ<div id='errbox'>err</div>


����ҳ����غ�ִ��������䣬����˵������
$('#formid').vForm({msgBoxClass: 'errClass',errBoxPrefixes:'errMsg_',inputErrClass:'input_warring'});

msgBoxClass: 'errClass',  //Ĭ�ϴ�����Ϣ����ʽ
inputErrClass:'input_warring'  //���� ������ʽ
*/

jQuery.fn.extend({
	vForm:function(options){
		var form=$(this),
		defaults={
			msgBoxClass: 'errClass',  
			inputErrClass:'input_warring'
		};
		var options = $.extend(defaults, options);
		form.submit(function(){return verify('submit'); });
		verify();
		function verify($s){			
			var 
			re=true,
			cursor=false,
			objs=form.find('input[alt],textarea[alt],select[alt],checkbox[alt]');
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
					
					if(obj.val()==null){var len=0}else{var len=obj.val().length}
					
					switch (v[0]) {
						case 'text':
						break;
						case 'email':
						reg_string = '(^[a-z0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,4}$)';
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
						reg_string = '(^[0-9]{15}([0-9Xx]{2,3})?$)';
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
						$('#'+user_define_errbox).show();
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