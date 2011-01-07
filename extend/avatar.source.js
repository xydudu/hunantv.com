// 弹出登陆
window.HN && window.jQuery && ( HN.avatar = function(){
	return {
		upload:function($type){
			var	utype=$type;
			HN.debug('Dialog Avatar is init');  			
			HN.ajax.get('http://www.tazai.com/home/profile/get_token',{},function($data){ //http://js.tazai.com/honey/demos/get_token.php
				var token=$data,
				 html = ['<div class="f-e" style="padding-left:0px;">', '<div class="e-title">', '<div class="l" style="height:20px; line-height:20px;">上传头像</div>', '<div class="r"><a href="javascript:" id="cam_avatar">使用网络摄像头拍照</a></div>', '</div>', '<div class="c-line" style="clear:both"></div>', '<div id="swf_btn" style="heigth:40px; margin-top:8px;"><span id="spanButtonPlaceholder"></span></div>', '<div class="e-10"></div>', '<div id="avatar_list"><span style=" color:#685E55;">(提示：请选择jpg、gif格式，且文件不能大于2M)</span></div></div>', '</div>'].join(''),
				html2 = ['<div class="f-e" style="padding:5px 0 0 0px;">', '<div class="e-title" style="height:20px;line-height:20px;">', '<div class="l"><span id="spanButtonPlaceholder"></span></div>', '<div class="r"><a href="javascript:" id="cam_avatar">使用网络摄像头拍照</a></div>', '</div>', '<div class="c-line"></div>', '<div id="swf_btn" style="heigth:40px; margin-top:8px;"></div>', '<div id="avatar_list"><div style="padding-top:12px; margin-left:72px; color:#685E55;">(提示：请选择jpg、gif格式，且文件不能大于2M)</div><div style="margin:40px auto 0 190px;"><a style="cursor:pointer; color:#728F16" class="hn-dialog-close">取消</a></div></div></div>', '<div id="AvatarEditor"></div>', '</div>', ].join('');
				//<img style="cursor:pointer;" class="hn-dialog-close" src="http://css.tazai.com/ui/mangoq/2010v1/images/button/avatar_cancel.jpg"/>
				if (utype == 'dialog') {
					HN.dialog.open({
						'body': html2,
						'disableBgClick': true,
						'opacity': 0.1,
						'className': 'f-all w-w428h273',
						'width': 428
					});
					HN.dialog.reSize(404, 149);
				} else if(utype == 'normal') {	
					$('#avatar_upload').html(html);
				}
				$('#cam_avatar').click(function() {
					callavatar(utype,'cam','');
				});
				
				function callavatar(utype,cam,data){
						if ($('#AvatarEditor').length < 1) {
							$('#avatar_upload').append('<div id="AvatarEditor"></div>');
						}
						if (utype == 'dialog') {
							HN.dialog.reSize(545, 592);
							function change_value(key) {
								HN.ajax.post('http://www.tazai.com/home/avatar/save/', {avatar_key: key},function($data) {
									$('#add_avatar_btn').before('<a href="javascript:"><img border="0" src="http://avatar.tazai.com/47/' + key + '" name="' + $data.id + '/' + key + '"></a>');
									$('#avatar_show').attr('src','http://avatar.tazai.com/200/'+$data.avatar_key);
									if ($("#avatar_small > a img[id!='add_avatar']").length >= 4) {
										$('#add_avatar_btn').hide();
									}
									HN.dialog.close();
									var c_a,t;
									$("#avatar_small > a img[id!='add_avatar']").hover(function() {
										clearTimeout(t);
										c_a = 1;
										var
										o = $(this),
										n = $("#avatar_small > a img[id!='add_avatar']").index(o);
										if (HN.ie6()) {var lp = 30;} else {var lp = 45;}
										$('#avatar_del_btn').attr('name', o.attr('name')).css('left', n * 51 + lp).show(0, function() {
											$(this).hover(function() {
												c_a = 0;
											},
											function() {
												c_a = 1;
											});
											//删除头像
											$('#avatar_del_btn').unbind('click').click(function() {
												var vo=$(this).attr('name');
												var id = $(this).attr('name').split('/')[0];
												$('#avatar_control').hide();
												$('#avatar_del_control').fadeIn(300,function(){
													var btn=$(this);
													btn.find('.sumbit').unbind('click').click(function() {
														HN.ajax.get('http://www.tazai.com/home/profile/del_avatar/' + vo, '', 
														function($data) {
															o.fadeOut(function() {
																o.remove();
																$('#avatar_show').attr('src', 'http://avatar.tazai.com/200/' + $data);
																$('#avatar_del_btn').hide(0);
																if ($("#avatar_small > a img[id!='add_avatar']").length < 4) {
																	$('#add_avatar_btn').show();	
																}
																btn.hide();
															});	
														});
													});
													btn.find('.avatar_control_cancel').unbind('click').click(function() {
														btn.hide();
													});
													
												});	
											});	
                                        });	
									},
									function() {
											t=setTimeout(function() {
												if (c_a) {
													$('#avatar_del_btn').hide();
												}
											},
											10);
									}).unbind('click').click(function() {				
											$('#avatar_show').remove();
											var
											aimg = $(this),
											set_img = aimg.attr('src').replace('/47/', '/200/'),
											bimg = new Image();
											$('#avatar-loading').show();
											bimg.onload = function() {
                                                $('.w230-picframe-img').html($('#avatar-loading').hide());
												$('.w230-picframe-img').append($(bimg));
												$(bimg).attr('id', "avatar_show");	
                                            };
											bimg.src = set_img;
											if ($(this).attr('rel') == 'true') {
												$('#avatar_control').hide();
												return false;
											}
											$('#avatar_control').hide().fadeIn(function() {
												var o = $(this);
												o.find('.avatar_control_cancel').unbind('click').click(function() {
													o.fadeOut(function() {
														if ($("#avatar_small > a img[rel='true']").length > 0) {
															$(bimg).attr('src', $("#avatar_small > a img[rel='true']").eq(0).attr('src').replace('/47/', '/200/'));	
														} else {
															$(bimg).attr('src', $("#avatar_small > a img[id!='add_avatar']").eq(0).attr('src').replace('/47/', '/200/'));	
														}	
													});	
												});
													o.find('.sumbit').attr('name', aimg.attr('name')).unbind('click').click(function() {
															HN.ajax.post('http://www.tazai.com/home/profile/main_avatar/' + $(this).attr('name'), '',
															function() {
																	$("#avatar_small > a img[id!='add_avatar']").attr('rel','avatar');
																	aimg.attr('rel','true');
																	o.fadeOut();
															});
													});
											});
									});
								},
								function() {
									alert('保存头像出错!');
								});
							}
							var settings = {
								flash_url: "http://js.tazai.com/honey/swf/avatareditor.swf",
								post_url: "http://imgupload.tazai.com/upload_avatar.php",
								flash_container: "AvatarEditor",
								width: "545",
								height: "550",
								window_mode: "transparent",
								send_complete_callback: change_value,
								cancel_callback: function(){HN.dialog.close();}
							};
							_AE = new AvatarEditor(settings);
							if(cam=='cam'){
								_AE.initCameraMode();
							}else{
								_AE.initPhotoMode(data[1]);
							}
							$('#avatar_list').hide();
						} else if(utype=='normal') {
							function change_values(key) {
								 $('#avatar_key').val(key);
								$('#AvatarEditor').remove();
								$('#avatar_show').html('<img src="http://avatar.tazai.com/200/' + key + '" />');
								$('#isavatar').val(1);
							}
							var settings = {
								flash_url: "http://js.tazai.com/honey/swf/avatareditor.swf",
								post_url: "http://imgupload.tazai.com/upload_avatar.php",
								flash_container: "AvatarEditor",
								width: "545",
								height: "550",
								window_mode: "transparent",
								send_complete_callback: change_values,
								cancel_callback: function(){$('#AvatarEditor').remove();$('#avatar_list').html('<span>(提示：请选择jpg、gif格式，且文件不能大于2M)</span>').show();}
							};
							_AE = new AvatarEditor(settings);
							if(cam=='cam'){
								_AE.initCameraMode();
							}else{
								_AE.initPhotoMode(data[1]);
							}
							$('#avatar_list').hide();
						}

				}
				
				var SWFU,
				upload = {
					utype: utype,
					options: function() {
						var up = window['upload'] = upload;
                        up.fileQueueError;
						return {
							file_post_name: "Filedata",
							flash_url: "http://www.tazai.com/swfupload.swf",
							upload_url: "http://imgupload.tazai.com/upload_avatar.php?action=upload",
							post_params: {
								'channel': 'avatar',
								'token': token
							},
							file_size_limit: "2 MB",
							file_types: "*.jpg;*.jpeg;*.gif;*.png",
							file_types_description: "jpg,gif",
							file_upload_limit: 20,
							file_queue_limit: 0,
							custom_settings: {
								progressTarget: "flashUploaderHolder",
								cancelButtonId: "btnCancel"
							},
							prevent_swf_caching:false,
							debug: false,
							button_image_url: HN.config.url.js + 'image/uploadface.jpg',
							button_width: "90",
							button_height: "30",
							button_placeholder_id: "spanButtonPlaceholder",
							file_queued_handler: up.fileQueued,
							file_queue_error_handler: up.fileQueuederr,
							file_dialog_complete_handler: up.fileDialogComplete,
							upload_start_handler: up.uploadStart,
							upload_progress_handler: up.uploadProgress,
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
					getSizeInKMG: function($num) {
						if (isNaN(!$num)) {
							return false;
						}
						var num = +$num,
						unit = [" B", " KB", " MB", " GB"];
						for (var i = 0; i < unit.length; i += 1) {
							if (num < 1024) {
								num = num + "";
								if (num.indexOf(".") != -1 && num.indexOf(".") != 3) {
									num = num.substring(0, 4);
								} else {
									num = num.substring(0, 3);
								}
								break;
							} else {
								num = num / 1024;
							}
						}
						return num + unit[i];
					},
					fileIds: '',
					changeHtml: false,
					fileQueued: function($file) {
						var up = upload;
						up.clearFileid;
						$('#isavatar').val(0);
						$('#avatar_list').html('<div class="fp-y-list2" id="' + $file.id + '"><div class="fp-y-c1">' + $file.name + '</div><div class="fp-y-c2">' + up.getSizeInKMG($file.size) + '</div></div>').show();
						up.fileIds = [];
						up.fileIds = $file.id;
						SWFU.startUpload();
					},
					clearFileid: function() {
						var file = SWFU.getFile(up.fileIds);
						if (!file)
						 return;
						SWFU.cancelUpload(up.fileIds);
					},
					
					fileQueuederr:function(file, errorCode, message) {
					try {
					
							switch (errorCode) {
							case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
								alert("只能上传2MB以下的图片!");
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
					fileDialogComplete: function() {
						this.debug('fileDialogComplete');
					},
					uploadStart: function($file) {
						var stats = SWFU.getStats(),
						up = upload,
						div = $('#' + $file.id);
						if (div.length > 0)
						 div.css({background: 'url(http://css.tazai.com/ui/mangoq/2010v1/images/bg/load_over.png) -480px 50% no-repeat'});
					},
					uploadProgress: function($file, $bytesLoaded, $totalBytes) {
						var progressLen = 400,
						progress = $('#' + $file.id),
						percent = Math.ceil(($bytesLoaded / $file.size) * progressLen),
						pos = progressLen - percent;
						if (pos >= 0) {
							progress.css('backgroundPosition', "-" + pos + "px 0px");
						} else {
							progress.css('backgroundPosition', '0px 0px');
						}
					},
					uploadSuccess: function($file, $serverData) {
						var data = eval('(' + $serverData + ')'),
						utype = upload.utype;
						callavatar(utype,'up',data);
					},
					uploadComplete: function($file) {
						if (this.getStats().files_queued === 0) {}
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

			},function(){
					HN.login().dialogLoginForm();
			});		
		}
    };
});
