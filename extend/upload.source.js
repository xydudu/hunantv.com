// 弹出登陆
window.HN && window.jQuery && ( HN.upload = function(){
	return {
		dialogUpload:function($uid,$tip,$album,$callback){
			HN.debug('DialogUploadForm is init');
			var data={uid:$uid,action:"upload"};
			HN.ajax.post('http://www.tazai.com/photo/album/list',data,function($data){
				var album_arr=$data['data'],
				token=$data['token'];
				if(!token){
					HN.go('login,form',function(){
						HN.login().dialogLoginForm();
					});
					return false;
				}
				
				var html=[//模板
				  '<div class="fp-frame">',
					'<div class="fp-title">上传照片</div>',
					'<div class="fp-whitebox" style="display:none;">',
					  '<div class="l fp-whitebox-w270">提示：请选择jpg/gif格式，单张照片不能大于5M，按Ctrl或Shift键可最多批量上传20张照片！</div>',
					  '<div class="r fp-whitebox-button1"><a href="javascript:" id="upload-button">正在加载上传组件..</a></div>',
					'</div>',
	
					'<div class="fp-yellowbox" style="height:75px; float:left;">',
					  '<div class="fp-y-title" style="display:none;">',
						'<div class="fp-y-c1">照片</div>',
						'<div class="fp-y-c3" id="title_state">删除</div>',
						'<div class="fp-y-c2">大小</div>',
					  '</div>',
					  '<div class="fp-y-lists" id="upload-file-list" style="height:75px; ">',
					  '<div class="l fp-whitebox-w270" style="padding:10px;">提示：请选择jpg/gif格式，单张照片不能大于5M，按Ctrl或Shift键可最多批量上传20张照片！</div>',
					  '</div>',
					  '<div style="clear:both"></div>',
					  '<div class="fp-y-buttom" style="margin-top:-70px">',
						'<div class="fp-y-buttom-l" style="display:none"><img src="http://css.tazai.com/ui/mangoq/2010v1/images/ico/action_del_default.gif"></div>',
						'<div class="l" style="display:none"><a id="clear_all_text" href="javascript:">清空列表</a> <span id="upload-file-total"></span></div>',
						'<div class="fp-y-buttom-r"><span id="spanButtonPlaceholder"></span></div>',
					  '</div>',
					'</div>',
	
					'<div class="e-20" style="height:12px;"></div>',
					'<div class="c fp-selcts" id="photo_album_list_box">',
					  '<div class="l fp-fontbasic">上传至相册：</div>',
					  '<div class="l fp-selectbox">',
						'<select id="photo_album_list">',
						'</select>',
					  '</div>',
					  '<div class="r fp-selects-new">',
						'<input name="" id="album_add_btn" type="image" src="http://css.tazai.com/ui/mangoq/2010v1/images/button/album_add.jpg" />',
					  '</div>',
					  '<div class="fp-selcts-child">',
						'<div>',
						  '<div class="l">相册名称：</div>',
						  '<div class="r"><span>(最多20个字符)</span></div>',
						'</div>',
						'<div class="c fp-selcts-input">',
						  '<input type="text" name="album_name" id="photo_album_creat_name" value="" />',
						'</div>',
						'<div>',
						  '<div class="l">',
							'<img id="photo_album_creat" style="cursor:pointer;" src="http://css.tazai.com/ui/mangoq/2010v1/images/button/album_save.gif" />',
						  '</div>',
						  '<div class="l fp-selcts-more"><a href="javascript:" id="photo_album_cancel">取消</a></div>',
						'</div>',
					  '</div>',
					'</div>',
					'<div class="c"></div>',
					'<div class="c fp-save" id="save-button-box">',
					  '<div class="fp-save-button">',
						'<input name="" type="image" id="upload_start_btn" src="http://css.tazai.com/ui/mangoq/2010v1/images/button/photo_upload.jpg" />',
					  '</div>',
					  '<div class="fp-save-more"><a href="javascript:" class="hn-dialog-close">取消</a></div>',
					'</div>',
				  '</div>'
				].join('');
				
				HN.dialog.open({
					'body':html,
					'disableBgClick': true,
					'opacity': 0.1,
					'className': 'f-all w-w454h428',
					'width': 454
				});
                HN.dialog.reSize(430,215);
				
				for(var i=0;i<album_arr.length;i++){
					if($album&&album_arr[i].album_id==$album){
						$('#photo_album_list').append('<option value="'+album_arr[i].album_id+'" selected="selected">'+album_arr[i].album_name+'</option>');
					}else{
						$('#photo_album_list').append('<option value="'+album_arr[i].album_id+'">'+album_arr[i].album_name+'</option>');
					}
				}
				
				if($tip==1){
					HN.dialog.reSize(540,285);
					$('.fp-frame').prepend('<div class="fp-notice">提示：该用户已上传多张照片，您必须同样拥有 <span>3张</span> 以上照片才能欣赏TA的全部靓照哦！</div>');
				}
				
				//加点点效果
				$('#hn-dialog').fadeIn(200,function(){
					//新建相册
					$('#album_add_btn').unbind('click').click(function(){
						$('#photo_album_list').hide(0);
						$('.fp-selcts-child').fadeIn();
						$('#photo_album_cancel').click(function(){
							$('.fp-selcts-child').fadeOut();
							$('#photo_album_list').show(0);
						});
						//新建相册保存
						$('#photo_album_creat').unbind('click').click(function(){
							var btn=$(this),v=$('#photo_album_creat_name').val();
							btn.hide();
							if(v.length<1){
								alert('相册名称不能为空');
								btn.show();
							}else if(v.replace(/[^\x00-\xff]/g,"**").length>20){
								alert('相册名长度不能超过20');
								btn.show();
							} else {
								HN.ajax.post('http://www.tazai.com/photo/album/add',{album_name:v},function($data){
									$('#photo_album_list').prepend('<option selected value="'+$data.album_id+'">'+$data.album_name+'</option>');
									$('.fp-selcts-child').fadeOut();
									$('#photo_album_list').show(0);
									btn.show();
								},
								function($data){
									HN.go('login,form',function(){
										HN.loadCSS('http://css.tazai.com/ui/mangoq/2010v1/css/reg.css');
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
								flash_url: "http://www.tazai.com/swfupload.swf",
								upload_url: "http://imgupload.tazai.com/upload_photo.php",
								//upload_url: HN.config.url.js + "demos/upload.php",
								post_params: {
									'channel': 'photo',
									'token': token
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
								prevent_swf_caching:false,
								button_image_url: HN.config.url.js + 'image/photo_add.gif',
								button_width: "78",
								button_height: "23",
								button_placeholder_id: "spanButtonPlaceholder",
								
								file_queued_handler: up.fileQueued,
								file_queue_error_handler: up.fileQueuederr,
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
					fileQueuederr:function(file, errorCode, message) {
					try {
							if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
								alert("一次最多只能上传20张照片！");
								return;
							}
					
							switch (errorCode) {
							case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
								alert("只能上传5MB以下的图片!");
								break;
							case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
								alert("不能上传空图片!");
								break;
							case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
								alert("图片格式不符合要求!");
								break;
							default:
								alert('系统错误! 请稍候再试');
								break;
							}
						} catch (ex) {
							this.debug(ex);
						}

					},
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
								$('.fp-y-buttom').attr('style','border-bottom:1px solid #C5B08B');
								$('.fp-y-buttom div').show();
								$('.fp-yellowbox .fp-y-title').show();
								$('.fp-yellowbox').css('height','245px');
								$('.fp-y-buttom-r').css('padding-top','5px');
								$('#upload-file-list').html('');
								up.changeHtml=true;
							}
							$('#upload-file-list').append('<div class="fp-y-list" id="' + $file.id + '"><div class="fp-y-c1">' + $file.name + '</div><div class="fp-y-c3"><a href="javascript:" onclick="deleteOneFile(\'' + $file.id + '\')" class="m-ico-del" ><img class="del_img_ico" src="http://css.tazai.com/ui/mangoq/2010v1/images/ico/action_del_default.gif"></a></div><div class="fp-y-c2">' + up.getSizeInKMG($file.size) + '</div></div>');
					
							$('.del_img_ico').hover(function() {
								$(this).attr('src', 'http://css.tazai.com/ui/mangoq/2010v1/images/ico/action_del_on.gif');
					
							},
							function() {
								$(this).attr('src', 'http://css.tazai.com/ui/mangoq/2010v1/images/ico/action_del_default.gif');
					
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
							$('#title_state').html('状态');
					
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
							if (div.length > 0) {div.css({
								background: 'url(http://css.tazai.com/ui/mangoq/2010v1/images/bg/load_over.png) -480px 50% no-repeat'
							});
							}
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
							var getData = $serverData,
							album_id =$('#photo_album_list').val();
							data = {album_id : album_id, field: getData};
							//保存相册
							HN.ajax.post('http://www.tazai.com/photo/photo/add', data,function($data) {
								$('#' + $file.id).find('img').unbind('mouseover mouseout').show().css('cursor', 'default').attr('src', 'http://css.tazai.com/ui/mangoq/2010v1/images/ico/action_del_ok.gif');
								upload.fileNameList.push($data);
								upload.savePhoto(album_id);
					
							},
							function() {
								$('#' + $file.id).css('background-color', '#c9c');
								$('#' + $file.id).find('img').unbind('mouseover mouseout').show().css('cursor', 'default').attr('src', 'http://css.tazai.com/ui/mangoq/2010v1/images/ico/action_del_on.gif');					
							});
					
						},
					
					savePhoto:function($album_id){
							if(upload.iscomplate){
								var i=0,len=upload.fileNameList.length,height=(Math.ceil(len/5))*140+145;
								if(height>565){height=565;}
								HN.dialog.reSize(615,height);
								var html=[
									'<div class="fp-frame fp-frame-3">',
									  '<div class="fp-title fp-frame-3-add">',
										'<div class="l">完善照片信息</div>',
										'<div class="r"></div>',
										'<div class="c fp-piclists-line"></div>',
									  '</div>',
									  
									  '<div class="fp-piclists" id="fp_pic_lists" style="height:auto; margin:10px 0 10px 10px;">',
									  '</div>',
									  
									  '<div class="c"></div>',
									  '<div class="fp-save">',
										'<div class="fp-save-button">',
										  '<input type="image" class="hn-dialog-close" src="http://css.tazai.com/ui/mangoq/2010v1/images/button/album_save2.jpg" name="">',
										'</div>',
									  '</div>',
									'</div>'
								].join('');
								$('#hn-dialog-body').html(html);
								
								if(height==565){
									$('#fp_pic_lists').css('height','455px').css('overflow-y','scroll');
								}
								for(i;i<len;i++){
									$('#fp_pic_lists').append('<div name="74" class="fp-piclist" style="position: relative;"> <dl> <dt> <div class="fp-piclists-del"></div> <div class="c" style="height: 80px;"><a href="javascript:"><img border="0" src="http://img.tazai.com/photo/small/'+upload.fileNameList[i].key+'"></a></div> <div class="fp-piclists-del"><a href="javascript:"><img src="http://css.tazai.com/ui/mangoq/2010v1/images/ico/photo_setdefault2.jpg" is_cover="true" key="'+upload.fileNameList[i].key+'" class="set_cover_btn" name="'+upload.fileNameList[i].id+'"></a><a href="javascript:"><img border="0" title="删除相片" src="http://css.tazai.com/ui/mangoq/2010v1/images/ico/photo_del.gif" key="'+upload.fileNameList[i].key+'" name="'+upload.fileNameList[i].id+'" class="del_photo_btn"></a></div> <div class="fp-piclists-floattips1" style="position: absolute; top: 76px; left: 58px; display: none;">设封面</div> </dt> <dd> <div> <div class="fp-piclists-write"><a href="javascript:"><img height="12" width="12" border="0" src="http://css.tazai.com/ui/mangoq/2010v1/images/ico/write.gif" title="编辑相片"></a></div> <div class="fp-piclists-title"><a alt="'+upload.fileNameList[i].id+'" href="javascript:">'+upload.fileNameList[i].des+'</a></div> </div> </dd> </dl> </div>');
								}
								$('.hn-dialog-close').unbind('click').bind('click',function(){
									if($tip==1){
										HN.dialog.close();
									}else if($tip==2){
										HN.dialog.close();
										location.href='/home/profile/info/'+$uid+'#photo_title_line';
									}else{
										HN.dialog.close();
										$callback.call();
										//location.href='/home/profile/info/'+$uid;
									}
								});
								//$('.hn-dialog-close').bind('click',(function(){HN.dialog.close();}));
								//修改相片信息 一些操作
								$('#fp_pic_lists').find('.del_photo_btn').unbind('click').bind('click',function(){
									var o=$(this),
									pid=[];
									pid.push(o.attr('name'));
									
									data={cover_photo_id:$album_id,photo_id:pid};
									obj=o.parent().parent().parent().parent().parent();
									delete_photo(obj,data);
								});

								var post_url = 'http://www.tazai.com/photo/photo/setdes';HN.tInput( {
									  target: '.fp-piclists-title a',
									  url: post_url,
									  id: 'photo_id',
									  value: 'photo_des'
								});
								$('.fp-piclists-write a').unbind('click').bind('click', (function() {
									  var obj = $(this).parent().siblings().find('a');
									  HN.tInput( {
											target: obj,
											url: post_url,
											id: 'photo_id',
											value: 'photo_des'
									  });
								}));

								function delete_photo($obj, $data) {
                                	HN.ajax.post('http://www.tazai.com/photo/photo/delete', $data,function($data) {
										$obj.fadeOut(200,
										function() {
											obj.remove();
										});
									},
									function() {
										alert('删除失败');
									});
                                }
								
								$('#fp_pic_lists').find('.set_cover_btn').unbind('click').bind('click', function() {
									  var o = $(this);
									  HN.ajax.post('http://www.tazai.com/photo/album/setcover', {
											album_id: $album_id,
											photo_id: o.attr('name'),
											key: o.attr('key')
											}, function($data) {
											$('#fp_pic_lists').find('.set_cover_btn').attr('src', 'http://css.tazai.com/ui/mangoq/2010v1/images/ico/photo_setdefault2.jpg');
											o.attr('src', 'http://css.tazai.com/ui/mangoq/2010v1/images/ico/photo_setdefault.jpg');
											o.attr('is_cover', 'true');
									  }, function() {
											alert('设置失败');
									  });
								});

								$('.set_cover_btn').bind('mouseover', function() {
									  $(this).parent().parent().siblings('.fp-piclists-floattips1').fadeIn(500);
								});
								$('.set_cover_btn').bind('mouseout', function() {
									  $(this).parent().parent().siblings('.fp-piclists-floattips1').fadeOut(100);
								});
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
					SWFU = new SWFUpload(upload.options());
				});	
			
			},function($data){
					alert('获取相册列表失败');
			});
						
		}
	}
});
