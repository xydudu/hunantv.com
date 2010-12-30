//xydudu start 7.21/2010 CTU
//hunantv.com javascript library core

var 
VERSION = 20100721,
HN = function($win, undefined) {
    var 
    makeCombo = false,
    addVersion = true,
    modData = {},
    mods = [],
    jsLoaded = {},
    cssLoaded = {},
    jsurl = 'http://js.tazai.com/honey/' ,
    isDev = this.isDev = 0;

    return {
        loadJS: function($src, $fun, $context) {
            var
            n = 0,
            s,
            src,
            items = typeof $src === 'string' ? [$src] : $src,
            l = items.length;
            process();

            function process() {
                if (n==l || n > l) {
                    $fun && $fun.call( $context||window );
                    s && (s.onload = s.onreadystatechange = null);
                } else {             
                    src = items[n];
                        HN.debug(src +' is loaded -------- OK');
                    if (jsLoaded[src]) {
                        n ++;
                        process();
                        return false;
                    }
                    jsLoaded[src] = true;
                    s = document.createElement("script");
                    s.type = "text/javascript";
                    s.onload = s.onreadystatechange = function() {
                        if (!s.readyState || s.readyState == "loaded" || s.readyState == "complete") {
                            n ++;
                            process();
                        }
                    };
                    s.onerror = function() {
                        HN.debug('error '+ n);
                        HN.debug('['+ src +'] is not loaded');    
                    };

                    s.src = addVersion ? (src +'?'+ VERSION) : src;
                    document.getElementsByTagName("head")[0].appendChild(s);
                }    

                return false;
            }
        },
        //
        //动态加载CSS
        //based from http://cse-mjmcl.cse.bris.ac.uk/blog/2005/08/18/1124396539593.html
        loadCSS: function($css) {
            if (cssLoaded[$css])
                return;
            if(document.createStyleSheet) {
                document.createStyleSheet($css);
            } else {
                var styles = "@import url('"+ $css +"');";
                var newSS = document.createElement('link');
                newSS.rel = 'stylesheet';
                newSS.href = 'data:text/css,'+escape(styles);
                document.getElementsByTagName("head")[0].appendChild(newSS);

            }
            HN.debug($css +' is loaded');
            cssLoaded[$css] = true;
        },
        // add a module       
        add: function($modId, $fun) {
            modData[$modId] = {
                creator: $fun,
                instance: null
            };      
        },

        start: function($modId) {
            var thisMod = modData[$modId];
            thisMod.instance = thisMod.creator(new SandBox(this));
            thisMod.instance.init();
        },
        
        stop: function($modId) {
            var thisMod = modData[$modId];
            if (thisMod.instance) {
                thisMod.instance.destroy();
                thisMod.instance = null;
            }
        },
        
        //$files: lib and mod names , 'jquery' use the most in Hunantv
        //$fun: the function will excute after dom, libs and mods loaded
        go: function($files, $fun, $needready, $first) {
            var 
            self = this,
            srcs = $files.split(','),
            srcarr = [],
            file,
            srcname;
            
            self.loadJS(jsurl +'hn.config.js', function() {
                
                while (srcs.length) {
                    srcname = HN.trim(srcs.shift());
                    if (HN.inArray(srcname, mods) < 0) {
                        mods.push(srcname);
                        if (srcname in HN.config.files) {
                            file = HN.config.files[srcname][0];
                            srcarr.push(jsurl + (isDev ? file.replace('.min.', '.source.') : file));
                        } else
                            HN.debug(srcname +'is not finded!');    
                    }
                }
                
                makeCombo ?
                self.combo(srcarr, $fun) :
                self.loadJS(srcarr, function() {
                    if ($first) {
                        $fun();
                        return false;    
                    }
                    window.jQuery ?
                        jQuery(document).ready($fun) :    
                        $fun();
                });

            });
        },
        
        combo: function($files, $fun) {
            var files = [];
            
            addVersion = false;
            while ($files.length) 
                files.push(HN.trim($files.shift()).replace(jsurl, '/js/'));    
            
            //this.loadJS(jsurl +'combo/?'+ files.join('&'), $fun);
            this.loadJS('http://betapi.hunantv.com/jsapi?'+ files.join('&'), $fun);
        },

        //use the source file 
        openDevMode: function() {
            this.isDev = isDev = 1; 
        },

        debug: function($msg) {
            if (!isDev) return;
            if (window.console && console.log)                
                console.log($msg);
            else {
                return ;
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
        },
        
        handleEvent: function($e) {
            var 
            e = $e || window.event,
            target = $(e.target || e.srcElement);
                    
            if(target.attr('hnevent')) {
                HN.debug(1);
                var fun = target.attr('hnevent').split('|');
                fun[0].call(target, fun.slice(1));
            }
            
        },

        /* 功能函数 */
        //去掉字符串两端多余空格
        trim: function($a) {
            return $a.replace(/^\s+|\s+$/g, ''); 
        },

        //判断$a是否在数组$b中
        //如果在，返回$a在$b中对应的下标
        inArray: function($a, $b) {
            for (var c = 0; c < $b.length; c++) { 
                if ($b[c] == $a) 
                    return c;
            }
            return -1;    
        },

        isString: function($o) {
            return typeof $o === 'string'; 
        },
        
        //生成两个数间的随机数
        random: function($min, $max) {
            return ($max-$min) * Math.random() + $min;
        },
        
        //事件代理
        delegate: function(rules) {
            return function($e) {
                var 
                e = $e || window.event,
                target = $(e.target || e.srcElement);

                //HN.debug(target[0].tagName);
                for (var selector in rules)
                  if (target.is(selector)) return rules[selector].apply(target, $.makeArray(arguments));
            };
        },
        
        //窗体滚动到某个元素的位置
        //可传jqury elem obj, elem id, elem, Y
        scrollTo: function($elem) {
            var X, Y;
            if ($elem.selector) {
                var offset = $elem.offset();
                X = offset.left;
                Y = offset.top;
            }
            if (HN.isString($elem)) 
                $elem = $win.document.getElementById($elem); 

            if ($elem.innerHTML) {
                while ($elem != null) {
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
                Y -= ($($win).height() / 2) - 100 :
                Y -= 200;
                

            window.scrollTo(X, Y);
        },

        ie6: function() {
            return (!$.support.opacity && $.browser.version.substr(0,1) < 7);    
        },

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
        ie: function() {
            var
            undef,
            v = 3,
            div = document.createElement('div');

            while(
                div.innerHTML = '<!--[if gt IE '+ (++v) +']><i></i><![endif]-->',
                div.getElementsByTagName('i')[0]
            );
            return v>4 ? v : undef;           
        }

    }; 
}(window);

