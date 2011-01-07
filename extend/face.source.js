// face
window.HN && window.jQuery && ( HN.face = function($o,$taget){
												   
	var box='<div id="face-show-box" style="position:absolute; display:none;" class="f-msgbox w-w242h99"><div class="f-top"> <div class="f-top-l"></div><div class="f-top-r"></div><div class="f-top-m w-top-m"></div></div><div class="f-main"><div class="f-main-l w-main-l"></div><div class="f-main-m w-main-m" id="content_box_face">      </div><div class="f-main-r w-main-r"><div class="f-main-r-bg"></div></div></div><div class="f-buttom"><div class="f-buttom-l"></div><div class="f-buttom-r"></div><div class="f-buttom-m w-buttom-m"><div class="f-buttom-m-bg"></div></div></div></div>';
	if($o&&$taget){
		$o.unbind('click').click(function() {
			var o = $(this),
			$box,
			offset = o.offset(),
			facehtml = '';
			for (i = 0; i < 18; i++) {
				facehtml += '<a href="javascript:" title="%face_' + i + '%"><img border="0" src="http:\/\/css.tazai.com\/ui\/mangoq\/2010v1\/images\/ico\/face_' + i + '.png" \/><\/a> ';
			}
			if(!$('#face-show-box').length){				
				 $('body').append($(box));
			}
			$box=$('#face-show-box');
			$box.css({left: offset.left-10,top: offset.top - 79});
			$box.find('#content_box_face').html(facehtml);
			$box.show();
			$box.find('a').unbind('click').bind('click',function() {
				var c = $taget.val(),
				fc = $(this).attr('title');
				$taget.val(c + fc);
/*
				var 
				textarea = $taget[0], 
				rangeData = getCursorPosition(textarea), 
				text = fc;
				var oValue, nValue, oR, sR, nStart, nEnd, st;
				setCursorPosition(textarea, rangeData);
				
				if (textarea.setSelectionRange) { // W3C
					oValue = textarea.value;
					nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
					nStart = nEnd = rangeData.start + text.length;
					st = textarea.scrollTop;
					textarea.value = nValue;
					// Fixbug:
					// After textarea.values = nValue, scrollTop value to 0
					if(textarea.scrollTop != st) {
						textarea.scrollTop = st;
					}
					textarea.setSelectionRange(nStart, nEnd);
				} else if (textarea.createTextRange) { // IE
					sR = document.selection.createRange();
					sR.text = text;
					sR.setEndPoint('StartToEnd', sR);
					sR.select();
				}*/

				$taget.focus();
				$box.hide();
			});
			$(document).unbind('mousedown').bind('mousedown',function(event) {
				if (!$(event.target).closest('#face-show-box').length) {
					$box.hide();
				}
			});
		});
	}
	
	/**
    * setCursorPosition Method
    *
    * Created by Blank Zheng on 2010/11/12.
    * Copyright (c) 2010 PlanABC.net. All rights reserved.
    *
    * The copyrights embodied in the content of this file are licensed under the BSD (revised) open source license.
    */
    function setCursorPosition(textarea, rangeData) {
        if(!rangeData) {
            alert("You must get cursor position first.");
        }
        if (textarea.setSelectionRange) { // W3C
            textarea.focus();
            textarea.setSelectionRange(rangeData.start, rangeData.end);
        } else if (textarea.createTextRange) { // IE
            var oR = textarea.createTextRange();
            // Fixbug :
            // In IE, if cursor position at the end of textarea, the setCursorPosition function don't work
            if(textarea.value.length === rangeData.start) {
                oR.collapse(false);
                oR.select();
            } else {
                oR.moveToBookmark(rangeData.bookmark);
                oR.select();
            }
        }
    }
    

    /**
    * getCursorPosition Method
    *
    * Created by Blank Zheng on 2010/11/12.
    * Copyright (c) 2010 PlanABC.net. All rights reserved.
    *
    * The copyrights embodied in the content of this file are licensed under the BSD (revised) open source license.
    */
    function getCursorPosition(textarea) {
        var rangeData = {text: "", start: 0, end: 0 };
            textarea.focus();
        if (textarea.setSelectionRange) { // W3C
            rangeData.start= textarea.selectionStart;
            rangeData.end = textarea.selectionEnd;
            rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end): "";
        } else if (document.selection) { // IE
            var i,
                oS = document.selection.createRange(),
                // Don't: oR = textarea.createTextRange()
                oR = document.body.createTextRange();
            oR.moveToElementText(textarea);

            rangeData.text = oS.text;
            rangeData.bookmark = oS.getBookmark();

            // object.moveStart(sUnit [, iCount])
            // Return Value: Integer that returns the number of units moved.
            for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i ++) {
                // Why? You can alert(textarea.value.length)
                if (textarea.value.charAt(i) == '\n') {
                    i ++;
                }
            }
            rangeData.start = i;
            rangeData.end = rangeData.text.length + rangeData.start;
        }

        return rangeData;
    }
	
	return {
		faceTo:function($str){
			$str=$str.replace(/\%face_([0-9]|1[0-8])\%/g, '<img onerror="this.src=\'http:\/\/css.tazai.com\/ui\/mangoq\/2010v1\/images\/ico\/face_2.png\';" src="http:\/\/css.tazai.com\/ui\/mangoq\/2010v1\/images\/ico\/face_$1.png"\/>');
			return $str;
		}
	}
	
});