/** js loader Copyright	Tero Piirainen (tipiirai) */
/* honey for hunantv 
 * xydudu 2010/12/30 last modified 
 * beta 1.0
 * */

var BASEURL = 'http://www.tazai.com/',
    JSURL = 'http://js.tazai.com/honey/',
    COMBOURL = 'http://js.tazai.com/',
    CSSURL = 'http://css.tazai.com/',
    VERSION = '20101230',
    isDev = false,
    COMBO = true;
(function(doc) { 

	var head = doc.documentElement,
		ie = navigator.userAgent.toLowerCase().indexOf("msie") != -1, 
		ready = false,	// is HEAD "ready"
		queue = [],		// if not -> defer execution
		handlers = {},	// user functions waiting for events
		scripts = {};		// loadable scripts in different states

	/*** public API ***/
    var api = window.honey = window.HN = (window.honey || function() { api.ready.apply(null, arguments); });


	api.js = function() {
        
		var args = arguments,
            rest = [].slice.call(args, 1),
			next = rest[0];

		if (!ready) {
			queue.push(function()  {
				api.js.apply(null, args);				
			});
			return api;
		}

		// multiple arguments	 
		if (next) {				

			// preload the rest
			if (!isFunc(next)) { 
				each(rest, function(el) {
					if (!isFunc(el)) {
						preload(getScript(el));
					} 
				});			
			}

			// load all recursively in order
			load(getScript(args[0]), isFunc(next) ? next : function() {
				api.js.apply(null, rest);
			});				

		// single script	
		} else {
			load(getScript(args[0]));
		}

		return api;		 
    };

	api.ready = function(key, fn) {
		var script = scripts[key];

		if (script && script.state == 'loaded') {
			fn.call();
			return api;
		}
        
		// shift arguments	
		if (isFunc(key)) {
			fn = key; 
			key = "ALL";
		}		 

		var arr = handlers[key];
		if (!arr) { arr = handlers[key] = [fn]; }
		else { arr.push(fn); }
		return api;
	};

	function toLabel(url) {		
		var els = url.split("/"),
			 name = els[els.length -1],
			 i = name.indexOf("?");

		return i != -1 ? name.substring(0, i) : name;				 
	}

    function getComboKey($key) {
        var p = new RegExp($key);
        for (var i = 0, l = comboMods.length; i < l; i ++) {
            if (p.test(comboMods[i])) return 'combo'+ i;
        }
        return false;
    }

	/*** private functions ***/
	function getScript(url) {

		var script;
		if (typeof url == 'object') {
			for (var key in url) {
				if (url[key]) {
					script = { name: key, url: url[key] };
				}
			}
		} else { 
			script = { name: toLabel(url),  url: url }; 
		}

		var existing = scripts[script.name];
		if (existing) { return existing; }

		scripts[script.name] = script;
		return script;
	}

	function each(arr, fn) {
		if (!arr) { return; }

		// arguments special type
		if (typeof arr == 'object') { arr = [].slice.call(arr); }

		// do the job
		for (var i = 0; i < arr.length; i++) {
			fn.call(arr, arr[i], i);
		}
	}

	function isFunc(el) {
		return Object.prototype.toString.call(el) == '[object Function]';
	} 


	function onPreload(script) {
		script.state = "preloaded";

		each(script.onpreload, function(el) {
			el.call();
		});					
	}

	function preload(script, callback) {

		if (!script.state) {

			script.state = "preloading";
			script.onpreload = [];

			/*
				Browser detection required. Firefox does not support script.type = text/cache
				http://www.phpied.com/preload-cssjavascript-without-execution/				
			*/	
			if (/Firefox/.test(navigator.userAgent)) {

				var obj = doc.createElement('object');
				obj.data = script.url;
				obj.width  = 0;
				obj.height = 0;		

				obj.onload = function() {
					onPreload(script);

					// avoid spinning progress indicator with setTimeout
					setTimeout(function() { head.removeChild(obj); }, 1);
				};

				head.appendChild(obj);

			} else {
				scriptTag({ src: script.url, type: 'cache'}, function()  {
					onPreload(script);		
				});
			}

		}
	}


	function load(script, callback) {	

		if (script.state == 'loaded') { 
			return callback && callback() ; 
		}

		if (script.state == 'preloading') {
			return script.onpreload.push(function()  {
				load(script, callback);	
			});
		}

		script.state = 'loading'; 

		scriptTag(script.url, function() {

			script.state = 'loaded';

			if (callback) { callback.call(); }			

			// handlers for this script
			each(handlers[script.name], function(fn) {
				fn.call();		
			});
            
            //for combo
            if (COMBO && script.name.indexOf('combo') > -1) 
                var 
                mod,
                mods = comboMods[+script.name.replace('combo', '')].split(',');
                while (mods && mods.length) {
                    mod = mods.shift(); 
                    if(!handlers[mod] || !handlers[mod].length) continue;
                    scripts[mod] = {name: mod, state: 'loaded'};
                    each(handlers[mod], function(fn) {
                        fn.call(); 
                    });
                }

			// TODO: do not run until DOM is loaded			
			var allLoaded = true;

			for (var name in scripts) {
				if (scripts[name].state != 'loaded') { allLoaded = false; }	
			}

			if (allLoaded) {
				each(handlers.ALL, function(fn) {
					if (!fn.done) { fn.call(); }
					fn.done = true;
				});
			}
		});
        return false;

	}   

	// if callback == true --> preload
	function scriptTag(src, callback)  {
        
		var elem = doc.createElement('script');		
		elem.type = 'text/' + (src.type || 'javascript');
		elem.src = src.src || src;  

		elem.onreadystatechange = elem.onload = function() {
			var state = elem.readyState;

			if (!callback.done && (!state || /loaded|complete/.test(state))) {
				callback.call();
				callback.done = true;
			}
		}; 

		head.appendChild(elem); 
	} 

	/*
		Start after a small delay: guessing that the the head tag needs to be closed
	*/	
	setTimeout(function() {
		ready = true;
		each(queue, function(fn) {
			fn.call();			
		});		
	}, 200);	
    
    //for honey
    var configjs;
    var combolists = [];
    api.go = function($files, $fun) {
         
        var 
        self = api,
        srcs = $files.split(','),
        srcarr = [],
        file,
        srcname;

        if (HN.config && HN.config.files) {
            gonext();
        } else {
            !configjs && api.js({config: JSURL +'hn.config.js'});
            api.ready('config', gonext);
        }
        configjs = 'loaded';    
        
        function gonext() {
            configjs =  HN.config.files;
            while (srcs.length) {
                srcname = HN.trim(srcs.shift());
                if (srcname in configjs) {
                    file = configjs[srcname];
                    file.js = {};
                    file.js[srcname] = (JSURL + (isDev ? file[0].replace('.min.', '.source.') : file[0]) +'?'+ VERSION);
                    
                    //!file.loaded && (COMBO ? combolists.push(file) : api.js(file.js));
                    !file.loaded && (COMBO ? combolists.push(srcname) : api.js(file.js));
                    
                    file.loaded = true;
                } else api.debug(srcname +'is not finded!');
            }

            COMBO && api.combojs(); 
            $fun && api.ready($fun);    
        }
    };
    
    var 
    comboNums = 0,
    comboMods = [];
    api.combojs = function() {
        if (!combolists.length) return;
        var files = '',
            file = '',
            mods = [],
            cjs = {},
            newarr = [];

        if (combolists.length > 9) {
            newarr = combolists.splice(0, 10);       
            while (newarr.length) {
                file = newarr.shift();
                files += ','+ configjs[file][0];
                mods.push(file);
            }
            
        } else {
            while (combolists.length) {
                file = combolists.shift();
                files += ','+ configjs[file][0];
                mods.push(file);
            }
        }

        cjs['combo'+ comboNums] = COMBOURL +'min/?f='+ files.substr(1) +'&v='+ VERSION;
        //cjs['combo'+ comboNums].mods = mods;
        comboNums ++;
        comboMods.push(mods.join(','));
        api.js(cjs);
        api.combojs();
    
    };

    api.debug = function($msg) {
        
        if (!isDev) return;
        if (window.console && console.log)                
            console.log($msg);
        else {
            var
            msg = document.createElement('p'),
            close = document.getElementById('honey-debug-close') ?
                document.getElementById('honey-debug-close') :
                document.createElement('input'),

            box = document.getElementById('honey-debug') ? 
                document.getElementById('honey-debug') : 
                document.createElement('div'); 
            if (!document.getElementById('honey-debug')) { 
                box.style.fontSize = '12px';
                box.style.color = '#fff';
                box.style.backgroundColor = 'gray';
                box.style.position = 'absolute';
                box.style.width = '300px';
                box.style.height = '200px';
                box.style.overflow = 'auto';
                box.style.right = '0';
                box.style.top = '0';
                box.id = 'honey-debug';
                document.body.appendChild(box);
                close.value = 'close';
                close.type = 'button';
                close.onclick = function() {
                    box.style.display = 'none';
                    isDev = true;    
                    return false;
                };
                box.appendChild(close);
            }
            msg.innerHTML = $msg;
            box.appendChild(msg);
            box.scrollTop = box.scrollHeight;
        }
    };

    api.openDevMode = function() {
        isDev = true; 
        COMBO = false; 
    };

    api.trim = function($a) {
        return $a.replace(/^\s+|\s+$/g, ''); 
    };

    //判断$a是否在数组$b中
    //如果在，返回$a在$b中对应的下标
    api.inArray = function($a, $b) {
        for (var c = 0; c < $b.length; c++) { 
            if ($b[c] == $a) 
                return c;
        }
        return -1;    
    };

    api.isString = function($o) {
        return typeof $o === 'string'; 
    };

    //生成两个数间的随机数
    api.random = function($min, $max) {
        return ($max-$min) * Math.random() + $min;
    };
    
    //事件代理
    api.delegate = function(rules) {
        return function($e) {
            var 
            e = $e || window.event,
            target = $(e.target || e.srcElement);

            //HN.debug(target[0].tagName);
            for (var selector in rules)
              if (target.is(selector)) return rules[selector].apply(target, $.makeArray(arguments));
        };
    };
    
    //窗体滚动到某个元素的位置
    //可传jqury elem obj, elem id, elem, Y
    api.scrollTo = function($elem) {
        var X, Y;
        if ($elem.selector) {
            var offset = $elem.offset();
            X = offset.left;
            Y = offset.top;
        }
        if (HN.isString($elem)) 
            $elem = window.document.getElementById($elem); 

        if ($elem.innerHTML) {
            while ($elem !== null) {
                X += $elem.offsetLeft;
                Y += $elem.offsetTop;
                $elem = $elem.offsetParent;
            }
        }
        
        if (typeof $elem == 'number') {
            X = 0;
            Y = $elem;
        }
        
        window.jQuery ?
            Y -= ($(window).height() / 2) - 100 :
            Y -= 200;
            

        window.scrollTo(X, Y);
    };

    api.ie6 = function() {
        return (!$.support.opacity && $.browser.version.substr(0,1) < 7);    
    };

    // ----------------------------------------------------------
    // If you're not in IE (or IE version is less than 5) then:
    //     ie === undefined
    // If you're in IE (>5) then you can determine which version:
    //     ie === 7; // IE7
    // Thus, to detect IE:
    //     if (ie) {}
    // And to detect the version:
    //     ie === 6 // IE6
    //     ie> 7 // IE8, IE9 ...
    //     ie <9 // Anything less than IE9
    // ----------------------------------------------------------
    // http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
    api.ie = function() {
        var
        undef,
        v = 3,
        div = document.createElement('div');

        while(
            div.innerHTML = '<!--[if gt IE '+ (++v) +']><i></i><![endif]-->',
            div.getElementsByTagName('i')[0]
        );
        return v>4 ? v : undef;           
    };

})(document);
