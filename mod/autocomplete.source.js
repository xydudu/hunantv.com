window.HN && window.jQuery && HN.ajax && (HN.autocomplete = function($target, $url, $option) {

    HN.debug('autocomplete is init!');

    var options = {
        boxId: 'autocomplete-box',
        liclass: 'li-selected'
    }, ul, current = -1, count = 0, setTimeoutobj, box,	liclass,  cvalue;

	$.extend(options, $option);
	box=options.boxId;
	liclass=options.liclass;

    $target.keyup(function(event) {
        var keycode = event.keyCode, offset = '', width = '', height = '', o = $(this);

        offset == '' ? offset = $target.offset() : '';
        width == '' ? width = $target.width() : '';
        height == '' ? height = $target.height() : '';

        if (keycode == 40) {
            selected(++current);

        } else if (keycode == 38) {
            selected(--current);

        } else if (keycode == 13) {
            $('#' + box).hide();

        } else {
            if (o.val().replace(' ', '').length >= 1) {
                if (o.val() != cvalue) {
                    var
                    data = {key: o.val()},
                    url = $url;
                    HN.ajax.post(url, data, 
                    function($data) {
                        count = $data.length;
                        showlist($data);
                        cvalue = o.val();

                    });

                }

            } else {
                o.val('');

            }

        }

        function selected($current) {
            if ($current < 0) {
                current = 0
            };
            if ($current >= count) {
                current = (count - 1)
            }
            $('#' + box).find('li').removeClass(liclass);
            $('#' + box).find('li').eq(current).addClass(liclass);
            $target.val($('#' + box).find('li').eq(current).html());

        }
        //show data list
        function showlist($data) {
            var div,html = '';
            $('#' + box).length ? 
            ul = $('#' + box) : 
            ul = $('<ul></ul>').attr('id', box).css({
                position: "absolute",
                left: offset.left + 'px',
                top: offset.top + height + 2 + 'px',
                width: width + 'px'
            }).hide();
            for (var i = 0; i < $data.length; i++) {
                html += '<li>' + $data[i] + '</li>';

            }
            $('#' + box).length ? '': $('body').append(ul);
            ul.html(html).show();

        }

    });

    $target.unbind('click blur').click(function() {		
        if(ul){ul.find('li').eq(current).addClass(liclass);ul.show()}

    });
	
	$( document ).bind( 'mousedown blur', function( event ) {
		if ( !$( event.target ).closest('#' + box).length ) {
			ul?ul.hide():'';
		}
	})

    //li bind click
    $('#' + box).find('li').die('click').live('click', (function() {
        $target.val($(this).html());
		current=$('#' + box).find('li').index($(this));
        $('#' + box).hide();
		
    }));

    $('#' + box).find('li').die('mouseover').live('mouseover', (function() {
        $('#' + box).find('li').removeClass(liclass);
        $(this).addClass(liclass);

    })).unbind('mouseout').live('mouseout', (function() {
		var i;
        $('#' + box).find('li').removeClass(liclass);
		current==-1?'':$('#' + box).find('li').eq(current).addClass(liclass);
    }));


});