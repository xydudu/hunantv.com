//xydudu 12.8/2010 
//全站能用的一些ajax 操作 

window.HN && HN.ajax && (function() {
    
    var 
    menubox = [
        '<div class="f-all" id="{{id}}">',
        '<div class="f-top">',
        '<div class="f-top-l" ></div>',
        '<div class="f-top-r" ></div>',
        '<div class="f-top-m w-top-m"></div>',
        '</div>',
        '<div class="f-main">',
        '<div class="f-main-l w-main-l"></div>',
        '<div class="f-main-m w-main-m">',

        '</div>',
        '<div class="f-main-r w-main-r">',
        '<div class="f-main-r-bg"></div>',
        '</div>',
        '</div>',
        '<div class="f-buttom">',
        '<div class="f-buttom-l"></div>',
        '<div class="f-buttom-r"></div>',
        '<div class="f-buttom-m w-buttom-m">',
        '<div class="f-buttom-m-bg"></div>',
        '</div>',
        '</div>',
        '</div>'
    ].join(''),
    overlay = [
        //'<iframe id="menu-bgframe" framebroder=0 />',
        '<div id="menu-overlay"></div>'
    ].join(''),
    viewHW = function() {
        var doc = $(window);
        return {
            height: doc.height(),
            width: doc.width()
        };
    },
    actions = {
        'del': {
            'ico': 'dot_x.gif',    
            'text': '删除',
            'className': 'hn-action-del'
        },

        'unfocus': {
            'ico': 'dot_x.gif',    
            'text': '删除',
            'className': 'hn-action-unfocus' 
        },

        'black': {
            'ico': 'dot_-.gif',    
            'text': '加入黑名单',
            'className': 'hn-action-block'
        },   

        'disblock': {
            'ico': 'dot_x.gif',
            'text': '删除',
            'className': 'hn-action-disblock'
        },

        'focus': {
            'ico': 'dot_+.jpg',
            'text': '关注',
            'className': 'hn-action-focus'
        },

        'report': {
            'ico': 'dot_!.gif',
            'text': '举报',
            'className': 'hn-action-report'
        },

        'hidden': {
            'ico': 'dot_hidden.gif',
            'text': '隐身',
            'className': 'hn-action-hidden'
        }
    };
    
    $('body').click(HN.delegate({
        '.hn-addfocus': function() {
            var 
            that = $(this),
            cid = that.attr('className').split('-').pop(),
            url = 'http://www.mangoq.com/relation/follow/add',
            activesrc = that.attr('over').replace('default', 'active');

            //loading ? need disgin
            HN.ajax.get(url, {oid: cid}, function() {
                that.attr({'src': activesrc, 'over': activesrc, 'className': 'hn-focused'}); 
                $('#hn-im-dialogbox').length && HN.IM.updateUserInfo(cid);
            }, function() {
                // error handle    
            });

            return false;       
        },

        '.hn-focused': function() {
            //已关注了的点击
            //何解？
            return false;
        },

        '.hn-action-unfocus': function() {
            //关注列表中的删除   
            //
            var 
            that = $(this),
            data = that.attr('className').split(' ')[1].split('-'),
            menuid = $('#hn-menu-'+ data[0]),
            cid = data[1];

            var 
            css = menuid.offset();
            box = createBox(css, 228, 80),
            inbox = box.find('div.f-main-m');
            $('#menu-overlay').trigger('click');
            //loading ? need disgin
            inbox.html([
                '<div class="chat-msg-del-content">是否确定取消关注该联系人<br>',
                '<div class="bt-save">',
                '<div class="l bt-save-l">',
                '<img src="/ui/mangoq/2010v1/images/ico/loading.gif" style="display:none" id="action-unfocus-loading" />',
                '<input type="image" src="/ui/mangoq/2010v1/images/button/sumbit_65x25.jpg" class="hn-unfocus-submit">',
                '</div>',
                '<div class="l bt-save-cancel"><a href="javascript:" class="hn-unfocus-close">取消</a></div>',
                '</div></div>'].join(''));
             
            box.click(HN.delegate({
                
                '.hn-unfocus-submit': function() {
                    //执行删除    
                    var l = $('#action-unfocus-loading');
                    
                    l.show();
                    HN.ajax.get('http://www.mangoq.com/relation/follow/del', {oid: cid}, function() {

                        inbox.html('操作成功！');
                        $('#useritem-'+ cid).fadeOut(500);
                        setTimeout(function() {
                            box.remove();
                        }, 500);
                        
                    }, function() {
                        
                        inbox.html('处理出错！');
                        setTimeout(function() {
                            box.remove();    
                        }, 1500);
                        
                    });
                },

                '.hn-unfocus-close': function() {
                    //取消 
                    box.remove();        
                    return false;
                }
                
            }));

            return false;
            
        },

        '.hn-action-focus': function() {
            var 
            that = $(this),
            data = that.attr('className').split(' ')[1].split('-'),
            menuid = $('#hn-menu-'+ data[0]),
            cid = data[1];

            var 
            css = menuid.offset();
            box = createBox(css, 228, 60),
            inbox = box.find('div.f-main-m');
            $('#menu-overlay').trigger('click');
            //loading ? need disgin
            inbox.html('loading...');
            HN.ajax.get('http://www.mangoq.com/relation/follow/add', {oid: cid}, function() {
                //$('#hn-im-dialogbox').length && HN.IM.updateUserInfo(cid);
                inbox.html('操作成功！');
                setTimeout(function() {
                    box.remove();
                }, 1000);
                menuid.find('a.hn-action-focus').html('关注成功').removeAttr('className');
                 
            }, function() {
                inbox.html('操作失败！');
                // error handle    
            });

            return false;  
        },
        
        '.hn-menu': function() {
            var 
            that = $(this),
            id,
            cls = that.attr('className').split(' '),
            menus = cls[1].split('-'),
            wh = cls[2].split('-'),
            cid = menus.pop(),
            offset = that.offset();

            if (that.data('isshow')) {
                $('#'+ that.data('menu-id')).hide();
                that.data('isshow', 0);
                bg.hide();
                //bgiframe.hide();
                return false;
            }
            
            if (that.data('menus')) {
                menus = that.data('menus').split('-');
                id = that.data('menu-id');
                $('#'+ id).show();
                bg.show();
                //bgiframe.show();
                that.data('isshow', 1);
                return false;
            }else {
                id = 'hn-menu-'+ parseInt(HN.random(1000, 2000));
                that.data('menu-id', id); 
                that.data('cid', cid); 
                that.data('menus', menus.join('-')); 
                $('body').append(menubox.replace('{{id}}', id));
            }
            
            
            if (!$('#menu-overlay').length) $('body').append(overlay); 
            
            bg = $('#menu-overlay');
            //bgiframe = $('#menu-bgframe');
            var view = viewHW();
            view.position = 'fixed';
            HN.ie6() && (view.position = 'absolute');
            view.top = 0;
            view.left = 0;
            //view.opacity = ;
            view.zIndex = '900';
            //view.backgroundColor = '#ccc';
            bg.css(view).show();
            //bgiframe.css(view).show();
             
            bg.click(function() {
                $('#'+ that.data('menu-id')).hide();     
                that.data('isshow', 0);
                bg.hide();
                //bgiframe.hide();
                return false;
            });


            $('#'+ id).css({
                height: wh[1],
                width: wh[0],
                left: offset.left,
                top: offset.top+30,
                position: 'absolute',
                zIndex: 901
            })
            .find('.w-top-m,.w-main-m,.w-buttom-m').width(wh[0]-24).end()
            .find('.w-main-l,.w-main-m,.w-main-r').height(wh[1]-24).end()
            .find('div.f-main-m').html(getMenusHtml(menus, cid, id.split('-')[2])).end().show();
            that.data('isshow', 1);
            return false;
        },

        '.hn-action-del': function() {
            var 
            that = $(this),
            data = that.attr('className').split(' ')[1].split('-'),
            menuid = $('#hn-menu-'+ data[0]),
            cid = data[1];

            var 
            css = menuid.offset();
            box = createBox(css, 228, 108),
            inbox = box.find('div.f-main-m');

            $('#menu-overlay').trigger('click');

            inbox.html([
                '<div class="chat-msg-del">',
                '<div class="chat-msg-del-content">是否确定删除该联系人<br>',
                '<input type="checkbox" value="1"  >',
                '<span>同时加入黑名单</span>',
                '<div class="bt-save">',
                '<div class="l bt-save-l">',
                '<img src="/ui/mangoq/2010v1/images/ico/loading.gif" style="display:none" id="action-del-loading" />',
                '<input type="image" src="/ui/mangoq/2010v1/images/button/chat_frame_del.jpg" class="hn-del-submit">',
                '</div>',
                '<div class="l bt-save-cancel"><a href="javascript:" class="hn-del-close">取消</a></div>',
                '</div>',
                '</div>',
                '<div class="chat-msg-del-r"><a href="javascript:"><img border="0" class="hn-del-close" src="/ui/mangoq/2010v1/images/ico/action_del_default3.jpg"></a></div>',
                '</div>'
            ].join('')).show();

            box.click(HN.delegate({
                
                '.hn-del-close': function() {
                    box.remove();        
                    return false; 
                },

                '.hn-del-submit': function() {
                    var l = $('#action-del-loading');
                    l.show();
                    HN.ajax.get('http://www.mangoq.com/chat/user/del', {cuid: cid}, function() {
                        if (box.find('input:checked').length) {
                            HN.ajax.get('http://www.mangoq.com/relation/black/add', {oid: cid}, function() {
                                //黑名单后，要显示 #im-isblock-box
                                showMsg('操作成功', 500); 
                                //if ($('#im-isblock-box').length) {
                                //    HN.IM.blockUser(cid);        
                                //    HN.IM.removeUser(cid);
                                //}
                                $('#im-isblock-box').length && HN.IM.removeUser(cid);
                            }, function() {
                                showMsg('操作出错', 1000); 
                            });
                        } else {
                            showMsg('操作成功', 500); 
                            $('#im-isblock-box').length && HN.IM.removeUser(cid);
                        }

                    }, function() {
                        showMsg('操作出错', 1000); 
                    }); 
                    return false;
                }
                    
            })); 

            function showMsg($msg, $times) {
                inbox.html('<div style="padding:20px 0; text-align: center">'+ $msg +'</div>');    
                setTimeout(function() {
                    box.remove();
                }, $times);       
            }        


            return false; 
        },
        
        //隐身
        '.hn-action-hidden': function() {
            //
            var 
            that = $(this),
            data = that.attr('className').split(' ')[1].split('-'),
            menuid = $('#hn-menu-'+ data[0]),
            cid = data[1];

            var 
            css = menuid.offset();
            box = createBox(css, 228, 80),
            inbox = box.find('div.f-main-m');
            $('#menu-overlay').trigger('click');
            //loading ? need disgin
            inbox.html([
                '<div class="chat-msg-del-content">是否确定对该联系人隐身<br>',
                '<div class="bt-save">',
                '<div class="l bt-save-l">',
                '<img src="/ui/mangoq/2010v1/images/ico/loading.gif" style="display:none" id="action-unhidden-loading" />',
                '<input type="image" src="/ui/mangoq/2010v1/images/button/sumbit_65x25.jpg" class="hn-unhidden-submit">',
                '</div>',
                '<div class="l bt-save-cancel"><a href="javascript:" class="hn-unhidden-close">取消</a></div>',
                '</div></div>'].join(''));
             
            box.click(HN.delegate({
                
                '.hn-unhidden-submit': function() {
                    //执行删除    
                    var l = $('#action-unhidden-loading');
                    
                    l.show();
                    HN.ajax.get('http://www.mangoq.com/relation/hidden/add', {oid: cid}, function() {

                        inbox.html('操作成功！');
                        setTimeout(function() {
                            box.remove();
                        }, 1000);
                        menuid.find('a.hn-action-focus').html('已隐身').removeAttr('className');
                        
                    }, function() {
                        
                        inbox.html('处理出错！');
                        setTimeout(function() {
                            box.remove();    
                        }, 1500);
                        
                    });
                },

                '.hn-unhidden-close': function() {
                    //取消 
                    box.remove();        
                    return false;
                }
                
            }));
            return false;
        },

        'img.deluser': function() {
            var
            that = $(this),
            cid = that.attr('className').split('-').pop(),
            userItem = $('#user-'+ cid),
            css = userItem.offset();
            css.left -= 230; 
            var
            box = createBox(css, 228, 108),
            inbox = box.find('div.f-main-m');
             
            inbox.html([
                '<div class="chat-msg-del">',
                '<div class="chat-msg-del-content">是否确定删除该联系人<br>',
                '<input type="checkbox" value="1"  >',
                '<span>同时加入黑名单</span>',
                '<div class="bt-save">',
                '<div class="l bt-save-l">',
                '<img src="/ui/mangoq/2010v1/images/ico/loading.gif" style="display:none" id="action-del-loading" />',
                '<input type="image" src="/ui/mangoq/2010v1/images/button/chat_frame_del.jpg" class="hn-del-submit">',
                '</div>',
                '<div class="l bt-save-cancel"><a href="javascript:" class="hn-del-close">取消</a></div>',
                '</div>',
                '</div>',
                '<div class="chat-msg-del-r"><a href="javascript:"><img border="0" class="hn-del-close" src="/ui/mangoq/2010v1/images/ico/action_del_default3.jpg"></a></div>',
                '</div>'
            ].join('')).show();
            
            inbox.click(HN.delegate({
                '.hn-del-submit': function() {
                    var l = $('#action-del-loading');
                    l.show();
                    HN.ajax.get('http://www.mangoq.com/chat/user/del', {cuid: cid}, function() {
                        if (box.find('input:checked').length) {
                            HN.ajax.get('http://www.mangoq.com/relation/black/add', {oid: cid}, function() {
                                //黑名单后，要显示 #im-isblock-box
                                showMsg('操作成功', 500); 
                                //if ($('#im-isblock-box').length) {
                                //    HN.IM.removeUser(cid);
                                //    HN.IM.blockUser(cid);        
                                //}
                                $('#im-isblock-box').length && HN.IM.removeUser(cid);
                            }, function() {
                                showMsg('操作出错', 1000); 
                            });
                        } else {
                            showMsg('操作成功', 500); 
                            $('#im-isblock-box').length && HN.IM.removeUser(cid);
                        }

                    }, function() {
                        showMsg('操作出错', 1000); 
                    }); 
                    return false;
                },

                '.hn-del-close': function() {
                    box.remove();
                    return false;
                } 
            }))

            function showMsg($msg, $times) {
                inbox.html('<div style="padding:20px 0; text-align: center">'+ $msg +'</div>');    
                setTimeout(function() {
                    box.remove();
                }, $times);       
            }

            return false;    
        },

        //加入黑名单
        '.hn-action-block': function() {
            var 
            that = $(this),
            data = that.attr('className').split(' ')[1].split('-'),
            menuid = $('#hn-menu-'+ data[0]),
            cid = data[1];

            var 
            css = menuid.offset();
            box = createBox(css, 228, 108),
            inbox = box.find('div.f-main-m'),

            $('#menu-overlay').trigger('click');

            inbox.html('loading...'); 

            HN.ajax.get('http://www.mangoq.com/relation/black/add', {oid: cid}, function() {
                showMsg('操作成功', 1000); 
                if ($('#im-isblock-box').length) HN.IM.blockUser(cid);        
                menuid.find('a.hn-action-focus').html('已入黑名单').removeAttr('className');
            }, function() {
                showMsg('操作出错', 1000); 
            });

            function showMsg($msg, $times) {
                inbox.html('<div style="padding:20px 0; text-align: center">'+ $msg +'</div>');    
                setTimeout(function() {
                    box.remove();
                }, $times);       
            }
        },
        
        //取消黑名单
        '.hn-action-disblock-im': function() {
            
            var 
            l = $('im-disblock-loading');
            cid = $(this).attr('className').split('-').pop();

            l.length && l.show(); 
            HN.ajax.get('http://www.mangoq.com/relation/black/del', {oid: cid}, function() {
                l.length && l.hide(); 
                if ($('#im-isblock-box').length) HN.IM.disblockUser(cid);        
            }, function() {
                l.length && l.hide(); 
                alert('操作出错'); 
            });
            
        },
         
        //取消黑名单，列表中
        '.hn-action-disblock': function() {
            //
            var 
            that = $(this),
            data = that.attr('className').split(' ')[1].split('-'),
            menuid = $('#hn-menu-'+ data[0]),
            cid = data[1];

            var 
            css = menuid.offset();
            box = createBox(css, 228, 80),
            inbox = box.find('div.f-main-m');
            $('#menu-overlay').trigger('click');
            //loading ? need disgin
            inbox.html([
                '<div class="chat-msg-del-content">确定把该联系人取消黑名单<br>',
                '<div class="bt-save">',
                '<div class="l bt-save-l">',
                '<img src="/ui/mangoq/2010v1/images/ico/loading.gif" style="display:none" id="action-disblock-loading" />',
                '<input type="image" src="/ui/mangoq/2010v1/images/button/sumbit_65x25.jpg" class="hn-disblock-submit">',
                '</div>',
                '<div class="l bt-save-cancel"><a href="javascript:" class="hn-disblock-close">取消</a></div>',
                '</div></div>'].join(''));
             
            box.click(HN.delegate({
                
                '.hn-disblock-submit': function() {
                    //执行删除    
                    var l = $('#action-disblock-loading');
                    
                    l.show();
                    HN.ajax.get('http://www.mangoq.com/relation/black/del', {oid: cid}, function() {

                        inbox.html('操作成功！');
                        $('#useritem-'+ cid).fadeOut(500);
                        setTimeout(function() {
                            box.remove();
                        }, 500);
                        
                    }, function() {
                        
                        inbox.html('处理出错！');
                        setTimeout(function() {
                            box.remove();    
                        }, 1500);
                        
                    });
                },

                '.hn-disblock-close': function() {
                    //取消 
                    box.remove();        
                    return false;
                }
                
            }));

            return false;
            
        },
        
        //举报
        '.hn-action-report': function() {
            var 
            that = $(this),
            data = that.attr('className').split(' ')[1].split('-'),
            menuid = $('#hn-menu-'+ data[0]),
            cid = data[1];

            var 
            css = menuid.offset();
            box = createBox(css, 228, 188),
            inbox = box.find('div.f-main-m'),

            $('#menu-overlay').trigger('click');

            inbox.html([
                '<div class="chat-msg-del">',
                '<div class="chat-msg-del-content">请选择举报理由<br>',
                '<input type="checkbox" value="1" name="">',
                '<span>发小广告</span><br>',
                '<input type="checkbox" value="2" name="">',
                '<span>色情、反动</span><br>',
                '<input type="checkbox" value="3" name="">',
                '<span>诈骗</span><br>',
                '<input type="checkbox" value="4" name="">',
                '<span>头像不是本人</span>',
                '<div class="c e-7"></div>',
                '<div class="bt-save">',
                '<div class="l bt-save-l">',
                '<img src="/ui/mangoq/2010v1/images/ico/loading.gif" style="display:none" id="action-report-loading" />',
                '<input type="image" src="http://css.mangoq.com/ui/mangoq/2010v1/images/button/chat_frame_cb.jpg" class="hn-report-submit">',
                '</div>',
                '<div class="l bt-save-cancel"><a href="javascript:" class="hn-report-close">取消</a></div>',
                '</div>',
                '</div>',
                '<div class="chat-msg-del-r"><a href="#"><img border="0" class="hn-report-close" src="http://css.mangoq.com/ui/mangoq/2010v1/images/ico/action_del_default3.jpg"></a></div>',
                '</div>'
            ].join('')); 

            inbox.click(HN.delegate({
                
                '.hn-report-close': function() {
                    box.remove();        
                    return false; 
                },

                '.hn-report-submit': function() {
                    var 
                    l = $('#action-report-loading'),
                    params = {
                        to_uid: cid, 
                        object_id: '', 
                        product_type: 4
                    },
                    vs = [];

                    if (inbox.find('input:checked').length) {
                        inbox.find('input:checked').each(function() {
                            vs.push(this.value); 
                        });
                    } else {
                        alert('请选择原因');
                        return false; 
                    }
                    params.reason = vs.join(',');
                    l.show();
                    HN.ajax.get('http://www.mangoq.com/relation/report/addreport', params, function() {
                        showMsg('操作成功', 1000); 
                    }, function() {
                        showMsg('操作出错', 1000); 
                    }); 
                    return false;
                }
            })); 
           
            function showMsg($msg, $times) {
                inbox.html('<div style="padding:20px 0; text-align: center">'+ $msg +'</div>');    
                setTimeout(function() {
                    box.remove();
                }, $times);       
            }
            
        }
        
    }));

    function getMenusHtml($menus, $cid, $menuid) {
        var 
        box = $('<div />').attr('className', 'type-action-float msg-frame-list'),
        actionTmpl = [
            '<div class="c">',
            '<div class="l taf-img"><img border="0" src="/ui/mangoq/2010v1/images/ico/[%=ico%]"></div>',
            '<div class="l"><a href="javascript:" class="[%=className%] '+ $menuid +'-'+ $cid +'">[%=text%]</a></div>',
            '</div>'
        ].join(''),
        html = [];

        while($menus.length)      
           html.push(HN.tmpl(actionTmpl, actions[$menus.shift()]));  
            
        return box.html(html.join('')); 
    }

    function createBox($css, $w, $h) {
        $('#hn-action-box').length && $('#hn-action-box').remove();
        $('body').append(menubox.replace('{{id}}', 'hn-action-box'));
        
        var 
        css = $css;
        css.position = 'absolute';
        css.zIndex = 902;            

        return setWH($('#hn-action-box'), $w, $h).css(css);

    }

    function setWH($box, $w, $h) {
        return $box.height($h).width($w)
            .find('.w-top-m,.w-main-m,.w-buttom-m').width($w-24).end()
            .find('.w-main-l,.w-main-m,.w-main-r').height($h-24).end();
    }

})();
