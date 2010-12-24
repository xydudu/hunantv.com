// dateSelect
window.HN && window.jQuery && ( HN.dateSelect = function($options){
	HN.debug('dateSelect is init!'); 

    var options = {
		Y:'#year',
		M:'#month',
		D:'#day',
		Max:2000,
		Min:1925,
		Set:[,,]		
    },	
	day=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	date=new Date(),
	Y=$(options.Y),
	M=$(options.M),
	D=$(options.D),
	option=['<option value="">请选择</option>'];
	
	
	$.extend(options, $options);
	
	var nowY=date.getFullYear();
	//插入年份
	for(var i=options.Max;i>=options.Min;i--){
		var s='';
		i==options.Set[0]?s='selected':'';
		option.push('<option value="'+ i +'" '+s+'>'+ i +'</option>');
	}
	Y.html(option.join(''));
	option=['<option value="">请选择</option>'];
	//插入月份
	for(var i=1;i<=12;i++){
		var s='';
		i==options.Set[1]?s='selected':'';
		option.push('<option value="'+ i +'" '+s+'>'+ i +'</option>');
	}
	M.html(option.join(''));
	
	//插入天数
	function M2Day($Y,$M){
		option=['<option value="">请选择</option>'];
		var n=day[+$M-1];
		if(IsPinYear($Y)&&+$M==2)n++;
		for(var i=1;i<=n;i++){
			var s='';
			i==options.Set[2]?s='selected':'';
			option.push('<option value="'+ i +'" '+s+'>'+ i +'</option>');
		}
		D.html(option.join(''));
	}
	M2Day(options.Set[0],options.Set[1]);
	
	//切换事件
	M.change(function(){
		M2Day(Y.val(),$(this).val());
	});
	Y.change(function(){
		M2Day($(this).val(),M.val());
	});
	
	//判断是否闰年
	function IsPinYear(year){
		return(0 == year%4 && (year%100 !=0 || year%400 == 0))
	}
		
	return {
		set:function($y,$m,$d){
			Y.find('option').removeAttr('selected');
			M.find('option').removeAttr('selected');
			D.find('option').removeAttr('selected');
			Y.find('option[value="'+$y+'"]').attr('selected','selected');
			M.find('option[value="'+$m+'"]').attr('selected','selected');
			D.find('option[value="'+$d+'"]').attr('selected','selected');			
		}
	}
	
});
