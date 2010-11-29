// 弹出登陆
window.HN && window.jQuery && ( HN.upload = function(){
	return {
		dialogUpload:function($uid,$tip){
			HN.debug('DialogLoginForm is init');  
			var
			html=[//模板
			  '<div class="fp-frame">',
				'<div class="fp-title">上传照片</div>',
				'<div class="fp-whitebox" style="display:none;">',
				  '<div class="l fp-whitebox-w270">提示：请选择jpg/gif格式，单张照片不能大于5M，按Ctrl或Shift键可最多批量上传20张照片！</div>',
				  '<div class="r fp-whitebox-button1"><a href="javascript:" id="upload-button">正在加载上传组件..</a></div>',
				'</div>',

				'<div class="fp-yellowbox" style="height:75px;">',
				  '<div class="fp-y-title" style="display:none;">',
					'<div class="fp-y-c1">照片</div>',
					'<div class="fp-y-c3">删除</div>',
					'<div class="fp-y-c2">大小</div>',
				  '</div>',
				  '<div class="fp-y-lists" id="upload-file-list" style="height:75px;">',
				  '<div class="l fp-whitebox-w270" style="padding:10px;">提示：请选择jpg/gif格式，单张照片不能大于5M，按Ctrl或Shift键可最多批量上传20张照片！</div>',
				  '</div>',
				  '<div style="clear:both"></div>',
				  '<div class="fp-y-buttom" style="background:#fff; margin-top:-70px">',
					'<div class="fp-y-buttom-l" style="display:none"><img src="http://css.mangoq.com/ui/mangoq/2010v1/images/ico/action_del_default.gif"></div>',
					'<div class="l" style="display:none"><a id="clear_all_text" href="javascript:">清空列表</a> <span id="upload-file-total"></span></div>',
					'<div class="fp-y-buttom-r"><span id="spanButtonPlaceholder"></span></div>',
				  '</div>',
				'</div>',

				'<div class="e-20" style="height:12px;"></div>',
				'<div class="c fp-selcts" id="photo_album_list_box">',
				  '<div class="l fp-fontbasic">上传至相册：</div>',
				  '<div class="l fp-selectbox">',
					'<select id="photo_album_list">',
					  '<option>默认相册</option>',
					'</select>',
				  '</div>',
				  '<div class="r fp-selects-new">',
					'<input name="" id="album_add_btn" type="image" src="http://css.mangoq.com/ui/mangoq/2010v1/images/button/album_add.jpg" />',
				  '</div>',
				  '<div class="fp-selcts-child">',
					'<div>',
					  '<div class="l">相册名称：</div>',
					  '<div class="r"><span>(最多10个字符)</span></div>',
					'</div>',
					'<div class="c fp-selcts-input">',
					  '<input type="text" name="album_name" id="photo_album_creat_name" value="" />',
					'</div>',
					'<div>',
					  '<div class="l">',
						'<img id="photo_album_creat" style="cursor:pointer;" src="http://css.mangoq.com/ui/mangoq/2010v1/images/button/album_save.gif" />',
					  '</div>',
					  '<div class="l fp-selcts-more"><a href="javascript:" id="photo_album_cancel">取消</a></div>',
					'</div>',
				  '</div>',
				'</div>',
				'<div class="c e-20" style="height:12px;">&nbsp;</div>',
				'<div class="c fp-save" id="save-button-box">',
				  '<div class="fp-save-button">',
					'<input name="" type="image" id="upload_start_btn" src="http://css.mangoq.com/ui/mangoq/2010v1/images/button/photo_upload.jpg" />',
				  '</div>',
				  '<div class="fp-save-more"><a href="javascript:" class="hn-dialog-close">取消</a></div>',
				'</div>',
			  '</div>'
			].join('');			
			
			if($('#hn-dialog').length>0){
				HN.dialog.reSize(430,245);
				$('#hn-dialog-body').html(html);
				$('.hn-dialog-close').bind('click',(function(){HN.dialog.close();}));
			} else {
				HN.dialog.open({
					'body':html,
					'disableBgClick': true,
					'opacity': 0.1,
					'className': 'f-all w-w454h428',
					'width': 454
				});
			}
			
			//取相册列表 
			var data={uid:$uid};
			HN.ajax.post('http://js.mangoq.com/honey/demos/get_photo_album_list.php',data,function($data){
				for(var i in $data){
					$('#photo_album_list').append('<option value="'+$data[i].album_id+'">'+$data[i].album_name+'</option>');
				}
			},
			function($data){
				$('#photo_album_list').html('<option>获取相册列表失败</option>');
			});
			
			if($tip){
				HN.dialog.reSize(540,285);
				$('.fp-frame').prepend('<div class="fp-notice">提示：该用户已上传多张照片，您必须同样拥有 <span>3张</span> 以上照片才能欣赏TA的全部靓照哦！</div>');
			}
			
			//加点点效果
			$('#hn-dialog').fadeIn(200,function(){
				//新建相册
				$('#album_add_btn').click(function(){
					$('.fp-selcts-child').fadeIn();
					$('#photo_album_cancel').click(function(){
						$('.fp-selcts-child').fadeOut();
					});
					//新建相册保存
					$('#photo_album_creat').click(function(){
						var v=$('#photo_album_creat_name').val();
						if(v.length<1){
							alert('相册名称不能为空');
						} else {
							HN.ajax.post('creat_photo_album.php',{album_name:v},function($data){
								$('#photo_album_list').prepend('<option selected value="'+$data.album_id+'">'+$data.album_name+'</option>');
								$('.fp-selcts-child').fadeOut();
							},
							function($data){
								HN.go('login,form',function(){
									HN.loadCSS('http://css.mangoq.com/ui/mangoq/2010v1/css/reg.css');
									HN.login().dialogLoginForm();
								});
							});
						}
					});
				});
				
				//上传
				var SWFU,
				upload = {
					options: function() {
						var up = window['upload'] = upload;
						return {
							file_post_name: "Filedata",
							flash_url: HN.config.url.js + "swf/swfupload.swf",
							//upload_url: "http://imgupload.mangoq.com/upload_photo.php",
							upload_url: HN.config.url.js + "demos/upload.php",
							post_params: {
								'channel': 'photo',
								'token': '67a054f163e442422bc237ce5b13f9f0'
							},
							file_size_limit: "5 MB",
							file_types: "*.jpg;*.jpeg;*.png;*.gif",
							file_types_description: "All Image Files",
							file_upload_limit: 20,
							file_queue_limit: 0,
							custom_settings: {
								progressTarget: "flashUploaderHolder",
								cancelButtonId: "btnCancel"				
							},
							debug: false,
							
							button_image_url: HN.config.url.js + 'image/photo_add.gif',
							button_width: "78",
							button_height: "23",
							button_placeholder_id: "spanButtonPlaceholder",
							
							file_queued_handler: up.fileQueued,
							file_queue_error_handler: up.fileQueueError,
							file_dialog_complete_handler: up.fileDialogComplete,
							upload_start_handler: up.uploadStart,
							upload_progress_handler: up.uploadProgress,
							upload_error_handler: up.uploadError,
							upload_success_handler: up.uploadSuccess,
							upload_complete_handler: up.uploadComplete,
							queue_complete_handler: up.queueComplete,				
							swfupload_pre_load_handler: up.swfUploadPreLoad,
							swfupload_load_failed_handler: up.swfUploadLoadFailed				
						};
				
					},
				
				swfUploadLoaded: function() {
						this.debug('swfUploadLoaded');				
				},
				
				fileCount: 0,
				
				getSizeInKMG: function($num) {
						if (isNaN(!$num)) {
							return false;
						}
						var
						num = +$num,
						unit = [" B", " KB", " MB", " GB"];
						for (var i = 0; i < unit.length; i += 1) {
							if (num < 1024) {
								num = num + "";
								if (num.indexOf(".") != -1 && num.indexOf(".") != 3) {
									num = num.substring(0, 4);				
								}
								else {
									num = num.substring(0, 3);				
								}
								break;				
							}
							else {
								num = num / 1024;				
							}				
						}
						return num + unit[i];				
					},
				
				fileIds: [],
				changeHtml:false,
				
				fileQueued: function($file) {
						var
						up = upload;
						up.fileCount++;
						window['deleteOneFile'] = up.deleteOneFile;
						window['cancelAll'] = up.cancelAll;
						window['startUp'] = up.startUp;
						if(!up.changeHtml){
							HN.dialog.reSize(430,387);
							$('.fp-notice').remove();
							$('#upload-file-list').css('height','178px');
							$('.fp-y-buttom').attr('style','');
							$('.fp-y-buttom div').show();
							$('.fp-yellowbox .fp-y-title').show();
							$('.fp-yellowbox').css('height','245px');
							$('#upload-file-list').html('');
							up.changeHtml=true;
						}
						$('#upload-file-list').append('<div class="fp-y-list" id="' + $file.id + '"><div class="fp-y-c1">' + $file.name + '</div><div class="fp-y-c3"><a href="javascript:" onclick="deleteOneFile(\'' + $file.id + '\')" class="m-ico-del" ><img class="del_img_ico" src="http://css.mangoq.com/ui/mangoq/2010v1/images/ico/action_del_default.gif"></a></div><div class="fp-y-c2">' + up.getSizeInKMG($file.size) + '</div></div>');
				
						$('.del_img_ico').hover(function() {
							$(this).attr('src', 'http://css.mangoq.com/ui/mangoq/2010v1/images/ico/action_del_on.gif');
				
						},
						function() {
							$(this).attr('src', 'http://css.mangoq.com/ui/mangoq/2010v1/images/ico/action_del_default.gif');
				
						});
						
						if ((up.fileCount) > 5) {
							$('#upload-file-list .fp-y-c3').css('text-align','right');
							$('#hn-dialog .fp-y-title').css('padding-right','16px');
							$('#upload-file-list').css('overflow-y', 'scroll');
				
						}
				
						$('#clear_all_text').bind('click', cancelAll);
						$('#upload_start_btn').bind('click', startUp);
						up.fileIds.push($file.id);
						up.updateTotal($file.size);
				
					},
				
				deleteOneFile: function($fileid) {
						var
						file = SWFU.getFile($fileid);
						if (!file) return;
						SWFU.cancelUpload($fileid);
						$('#' + $fileid).fadeOut(200, 
						function() {
							$(this).remove();
				
						});
						upload.fileCount--;
						if ((upload.fileCount) <= 5) {
							$('#upload-file-list .fp-y-c3').css('text-align','center');
							$('#hn-dialog .fp-y-title').css('padding-right','8px');
							$('#upload-file-list').css('overflow-y', 'hidden');
				
						}
						upload.updateTotal(0 - file.size);
				
					},
				
				totalSize: 0,
				
				updateTotal: function($s) {
						var up = upload;
						if (!isNaN($s)) up.totalSize += $s;
						$('#upload-file-total').html('共' + up.fileCount + '张照片(总计：' + up.getSizeInKMG(up.totalSize) + ')');
				
					},
				
				cancelAll: function($cancel) {
						var
						up = upload,
						fileIds = up.fileIds;
						for (var i = 0; i < fileIds.length; i++) {
							up.deleteOneFile(fileIds[i]);
				
						}
						up.fileCount = 0;
						up.totalSize = 0;
						up.updateTotal();
						if ($cancel == 1) {
							$('#hn-dialog').hide();
						}
				
					},
				
				startUp: function() {
				
						if (upload.fileCount < 1) return;
						$('#upload-file-list .del_img_ico').hide();
						$('#photo_album_list').attr('disabled', 'disabled');
						$('#upload_start_btn, #clear_all_text, #album_add_btn').unbind('click').css('cursor', 'default').css('color', '#999');
				
						SWFU.setButtonDisabled(true);
						SWFU.startUpload();
						document.getElementById('upload-file-list').parentNode.scrollTop = 0;
				
					},
				
				fileQueueError: function() {
						this.debug('fileQueueError');
				
					},
					fileDialogComplete: function() {
						this.debug('fileDialogComplete');
				
					},
				
				uploadStart: function($file) {
						var
						stats = SWFU.getStats(),
						up = upload,
						position = up.fileCount - stats.files_queued + 1,
						div = $('#' + $file.id);
						if (div.length > 0) div.css({
							background: 'url(http://css.mangoq.com/ui/mangoq/2010v1/images/bg/load_over.png) -480px 50% no-repeat'
						});
				
				
					},
				
				uploadProgress: function($file, $bytesLoaded, $totalBytes) {
						var
						progressLen = 400,
						progress = $('#' + $file.id),
						percent = Math.ceil(($bytesLoaded / $file.size) * progressLen),
						pos = progressLen - percent;
				
						if (pos >= 0) {
							progress.css('backgroundPosition', "-" + pos + "px 0px");
				
						} else {
							progress.css('backgroundPosition', '0px 0px');
				
						}
				
				
					},
				
				uploadError: function(file, errorCode, message) {
						try {
							switch (errorCode) {
								case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
								this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
								break;
								case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
								this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
								break;
								case SWFUpload.UPLOAD_ERROR.IO_ERROR:
								this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
								break;
								case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
								this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
								break;
								case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
								this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
								break;
								case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
								this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
								break;
								case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
								break;
								case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
								break;
								default:
								this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
								break;
				
							}
				
				
						} catch(ex) {
							this.debug(ex);
				
						}
				
					},
				
				fileNameList: [],
				iscomplate:false,
				
				uploadSuccess: function($file, $serverData) {
						//{"err":0,"data":{"photo_name":"111.png","photo_key":"4cee17edee9fb","width":500,"height":400}}
						var getData = eval('(' + $serverData + ')');
						data = {album_id : $('#photo_album_list').val(), field: getData};
						HN.ajax.post('http://js.mangoq.com/honey/demos/save_photo_item.php', data,function($data) {
							$('#' + $file.id).find('img').unbind('mouseover mouseout').show().css('cursor', 'default').attr('src', 'http://css.mangoq.com/ui/mangoq/2010v1/images/ico/action_del_ok.gif');
							upload.fileNameList.push($data);
							upload.savePhoto();
				
						},
						function() {
							$('#' + $file.id).css('background-color', '#c9c')
							$('#' + $file.id).find('img').unbind('mouseover mouseout').show().css('cursor', 'default').attr('src', 'http://css.mangoq.com/ui/mangoq/2010v1/images/ico/action_del_on.gif');
				
						});
				
					},
				
				savePhoto:function(){
						if(upload.iscomplate){
							var i=0,len=upload.fileNameList.length;
							HN.debug(len)
							HN.dialog.reSize(645,500);
							var html=[
								'<div class="fp-frame fp-frame-3">',
								  '<div class="fp-title fp-frame-3-add">',
									'<div class="l">完善照片信息</div>',
									'<div class="r"><a href="javascript:HN.dialog.close();window.location=window.location.href;">&gt;&gt;跳过次步骤</a></div>',
									'<div class="c fp-piclists-line"></div>',
								  '</div>',
								  
								  '<div class="fp-piclists" id="fp_pic_lists">',
								  '</div>',
								  
								  '<div class="c e-30"></div>',
								  '<div class="fp-save">',
									'<div class="fp-save-button">',
									  '<input type="image" class="hn-dialog-close" src="http://css.mangoq.com/ui/mangoq/2010v1/images/button/album_save2.jpg" name="">',
									'</div>',
								  '</div>',
								'</div>'
							].join('');
							
							$('#hn-dialog-body').html(html);
							
							for(i;i<len;i++){
								$('#fp_pic_lists').append('<div class="fp-piclist"><dl><dt><div class="fp-piclists-del"><a href="javascript:"><img height="13" width="14" src="http://css.mangoq.com/ui/mangoq/2010v1/images/ico/action_del_bg.jpg"></a></div><div class="c"><a href="#"><img border="0" src="http://css.mangoq.com/ui/mangoq/2010v1/images/face/105_1.jpg" id="'+upload.fileNameList[i].key+'"></a></div></dt><dd><div><div class="fp-piclists-write"><a href="#"><img height="12" width="12" border="0" src="http://css.mangoq.com/ui/mangoq/2010v1/images/ico/write.jpg"></a></div><div class="fp-piclists-title"><a href="#">'+upload.fileNameList[i].des+'</a></div></div><div><div class="fp-piclists-radio"><input type="radio" value="'+upload.fileNameList[i].id+'" name=""></div><div class="fp-piclists-txt">设为封面</div></div></dd></dl></div>');
							}
							$('.hn-dialog-close').bind('click',(function(){HN.dialog.close();}));
							//修改相片信息 一些操作
							
							//还未完成
						}
				},
				//上传完
				uploadComplete: function($file) {
						if (this.getStats().files_queued === 0) {
							upload.iscomplate=true;
				
						} else {
							upload.iscomplate=false;
							this.startUpload();				
						}
				
					},
				
				queueComplete: function() {
						this.debug('queueComplete');
				
					},
					swfUploadPreLoad: function() {
						this.debug('swfUploadPreLoad');
				
					},
					swfUploadLoadFailed: function() {
						this.debug('swfUploadLoadFailed');
				
					}
				
				};
				SWFU = new SWFUpload(upload.options())
			});				
		}
	}
});