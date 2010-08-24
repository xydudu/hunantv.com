//xydudu 8.16/2010 CTU
//上传通用组件，基于SWFupload
//

window.HN && (HN.upload = function($settings) {

    var 
    defaultHandlers = [
        'swfuploed',
        'fileQueued',
        'fileQueueError',
        'fileDialogStart',
        'fileDialogComplete',
        'uploadStart',
        'uploadProgress',
        'uploadErrorHandler',
        'uploadSuccess',
        'uploadComplete',
        'queueComplete'
    ],
    settings = {
        flash_url: HN.config.url.js +"swf/swfupload.swf",
        upload_url: 'upload.php',
        post_params: {},
        file_size_limit: '100 MB',
        file_types: '*.jpg;*.gif;*.png',

        //button_image_url: HN.config.url.js +'image/XPButtonUploadText_61x22.png',
        button_width: "61",
        button_height: "22",
        button_text: 'select files',
        button_placeholder_id: "upload-button",

        debug: HN.isDev 
        
    };
    
    $.extend(settings, $settings); 
    
    HN.debug(settings);

    return new SWFUpload(settings);
    
});
