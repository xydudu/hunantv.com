var AvatarEditor = function (settings) {
    this.initAvatarEditor(settings); 
};
AvatarEditor.instances = {};
AvatarEditor.movieCount = 0;

AvatarEditor.prototype.initAvatarEditor = function (settings) {
    try {
        this.settings = settings;
        this.movieName = "AvatarEditor_" + (AvatarEditor.movieCount++);
        this.movieElement = null;
        AvatarEditor.instances[this.movieName] = this;
        this.initSettings();
    } catch (ex) {
        delete AvatarEditor.instances[this.movieName];
        throw ex;
    }
};

AvatarEditor.prototype.initSettings = function () {
    //初始化
    this.ensureDefault = function (settingName, defaultValue) {
        this.settings[settingName] = (this.settings[settingName] == undefined) ? defaultValue : this.settings[settingName];
    };

    this.ensureDefault("switch_handler", null);
    this.ensureDefault("send_complete_handler", null);
    this.ensureDefault("cancel_handler", null);
};

AvatarEditor.prototype.initPhotoMode = function (photo_url) {
    //初始化照片模式
    this.settings.editor_mode = 'photo';
    this.settings.photo_url = photo_url;
    this.loadFlash();
};

AvatarEditor.prototype.initCameraMode = function () {
    //初始化摄像模式
    this.settings.editor_mode = 'camera';
    this.settings.photo_url = '';
    this.loadFlash();
};

AvatarEditor.prototype.upload = function () {
    alert('回调JS的“上传”函数');
};

AvatarEditor.prototype.cancel = function () {
    alert('回调JS的“取消”函数');
    document.getElementById(this.settings.flash_container).innerHTML = '';
};

AvatarEditor.prototype.loadFlash = function () {
    document.getElementById(this.settings.flash_container).innerHTML = this.getFlashHTML();

    // Fix IE Flash/Form bug
    if (window[this.movieName] == undefined) {
        window[this.movieName] = this.getMovieElement();
    }
};

AvatarEditor.prototype.getFlashHTML = function () {
    var str = '<object id="'+this.movieName+'" name="'+this.movieName+'" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+this.settings.width+'" height="'+this.settings.height+'" align="middle">';
            str += '<param name="movie" value="'+this.settings.flash_url+'" />';
            str += '<param name="wmode" value="'+this.settings.window_mode+'" />';
            str += '<param name="allowScriptAccess" value="always" />';
            str += '<param name="quality" value="high" />';
            str += '<param name="menu" value="true" />';
            str += '<param name="allowFullScreen" value="true" />';
            str += '<param name="flashvars" value="'+this.getFlashVars()+'" />';
            str += '<embed id="'+this.movieName+'" name="'+this.movieName+'" src="'+this.settings.flash_url+'" width="'+this.settings.width+'" height="'+this.settings.height+'" flashvars="'+this.getFlashVars()+'" wmode="'+this.settings.window_mode+'" allowFullScreen="true" quality="high" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"></embed></object>';
    return [str];
};

AvatarEditor.prototype.getFlashVars = function () {
    // Build a string from the post param object
    //var paramString = this.buildParamString();
    //var httpSuccessString = this.settings.http_success.join(",");

    // Build the parameter string
    return ["movie_name=", encodeURIComponent(this.movieName),
            "&amp;editor_mode=", encodeURIComponent(this.settings.editor_mode),
            "&amp;photo_url=", encodeURIComponent(this.settings.photo_url),
            "&amp;post_url=", encodeURIComponent(this.settings.post_url),
            "&amp;send_complete_callback=", encodeURIComponent(this.settings.send_complete_callback),
            "&amp;cancel_callback=", encodeURIComponent(this.settings.cancel_callback)
        ].join("");
};

// Private: buildParamString takes the name/value pairs in the post_params setting object
// and joins them up in to a string formatted "name=value&amp;name=value"
AvatarEditor.prototype.buildParamString = function () {
    var postParams = this.settings.post_params;
    var paramStringPairs = [];

    if (typeof(postParams) === "object") {
        for (var name in postParams) {
            if (postParams.hasOwnProperty(name)) {
                paramStringPairs.push(encodeURIComponent(name.toString()) + "=" + encodeURIComponent(postParams[name].toString()));
            }
        }
    }

    return paramStringPairs.join("&amp;");
};

AvatarEditor.prototype.getMovieElement = function () {
    if (this.movieElement == undefined) {
        this.movieElement = document.getElementById(this.movieName);
    }

    if (this.movieElement === null) {
        throw "Could not find Flash element";
    }

    return this.movieElement;
};

AvatarEditor.prototype.sendCompleteHandler = function (key) {
    alert("返回："+key);
    $('#avatar_key').val(key);
};
