//xydudu start 7.21/2010 CTU
//hunantv.com javascript library core

var 
VERSION = 20100721,
HN = function() {
    var 
    modData = {},
    jsLoaded = {},
    cssLoaded = {},
    jsurl = 'http://jsdev.hunantv.com/', 
    isDev = 0;

    return {
        //
        loadJS: function($src, $fun, $context) {
            var
            n = 0,
            s,
            src,
            items = typeof $src === 'string' ? [$src] : $src,
            l = items.length;
            process();

            function process() {
                if (n === l) {
                    $fun && $fun.call( $context||window );
                    s.onload = s.onreadystatechange = null;
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
                        HN.debug('['+ src +'] is not loaded');    
                    };

                    s.src = src +'?'+ VERSION;
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
                return false;
            if(document.createStyleSheet) {
                document.createStyleSheet($css);
            } else {
                var styles = "@import url('"+ $css +"');";
                var newSS=document.createElement('link');
                newSS.rel='stylesheet';
                newSS.href='data:text/css,'+escape(styles);
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
        go: function($files, $fun, $needready) {
            var 
            self = this,
            srcs = $files.split(','),
            srcarr = [],
            file,
            srcname;

            self.loadJS(jsurl +'hn.config.js', function() {
                
                while (srcs.length) {
                    srcname = HN.trim(srcs.shift());
                    if (srcname in HN.config.files) {
                        file = HN.config.files[srcname][0];
                        srcarr.push(jsurl + (isDev ? file.replace('.min.', '.source.') : file));
                    } else
                        HN.debug(srcname +'is not finded!');
                }

                HN.debug(srcarr);
                self.loadJS(srcarr, function() {
                    jQuery && jQuery(document).ready($fun);    
                });

            });
        },

        //use the source file 
        openDevMode: function() {
            isDev = 1; 
        },

        debug: function($msg) {
            if (!isDev) return;
            if (window.console && console.log)                
                console.log($msg);
            else {
                var box = document.createElement('div');
                box.style.fontSize = '12px';
                box.style.color = 'gray';
                box.innerHTML = $msg;
                document.body.appendChild(box);
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
                if ($b[c] === $a) 
                    return c;
            }
            return false;    
        },

        isString: function($o) {
            return typeof $o === 'string'; 
        },

        ie6: function() {
            return (!$.support.opacity && $.browser.version.substr(0,1) < 7);    
        }
    }; 
}();

