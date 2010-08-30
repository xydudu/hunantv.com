//评论 xydudu 8.30/2010 CTU
//comment for everywhere
//need jquery, ajax

window.HN && window.jQuery && HN.ajax (HN.comment = function() {
        
    var 
    settings = {
        url: 'http://newcomment.hunantv.com',
        project: 'guestbood'
    },
    page = 1,
    currentSID = 0;

    
    return {
        
        //获取列表，可以不要，实例化时便获取
        getList: function() {
            
        },
        
        //提交评论
        post: function() {
            
        },

        //提交某评论的回复
        postReply: function() {
            
            
        },
        
        //删除一条评论
        del: function() {
            
            
        },
        
        //删除一条回复
        delReply: function() {
            
            
        },

        //顶一条评论
        digg: function() {
            
            
        }
        
        /**
         *
         *  解决模版问题，不能限定死评论的样式。。
         *
         **/

       
    }; 
    
});
