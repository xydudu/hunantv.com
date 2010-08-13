// 投票的封装，lzd负责  8.10/2010
HN && jQuery && HN.ajax &&(HN.vote = function(){
	HN.debug('HN.vote is init');  
	var
	tips=[
		  '投票成功！', //0
		  '非法操作',   //1
		  '没有登录！',  //2
		  '您不久前刚投过票，过一会再来吧！', //3
		  '您的积分不足，赶快赚取积分后再来投票吧！',  //4
		  '您的积分不足8个，赶快赚取积分后再来投票吧！', //5
		  '您的积分不足15个，赶快赚取积分后再来投票吧！',	//6 
		  '此选手因刷票已被锁定，暂不能投票！'	//7
		 ],
	good=$('#vote-num-d'),
	bad=$('#vote-num-c'),
	postApi='http://localhost/demos/test-extend-vote.php',//'http://2.vote.hunantv.com/' + $active + '/' + $putType + '/oid/' + $id + '/optype/' + $action;  //
	getApi='http://localhost/demos/test-extend-vote.php';//'http://2.vote.hunantv.com/' + $active + '/' + $getType + '/oid/'+ $id;  //
	
	return {
		//HN.vote.doVote(callback,id,[boy,girl,missstar...],[put,mulput],[d,c])
		doVote:function ($callBack,$id,$active,$action,$putType){
			$active==null?$active='boy':'';
			$putType==null?$putType='put':'';
			$action==null?$action='d':'';
			HN.ajax.xGet(postApi, {diffdomain:1}, function($data) {
				good.html($data[0]);
				bad.html($data[1]);
				$callBack.call(this,'投票成功！');
			}
			, function($data) {
				callBack.call(this,tips[$data[0]]);
			})
		},
		//HN.vote.getVote(id,[boy,girl,missstar...],[get,mulget])
		getVote: function ($id,$active,$getType){
			$active==null?$active='boy':'';
			$getType==null?$getType='get':'';
			HN.ajax.xGet(getApi, {diffdomain:1}, function($data) {
				good.html($data[1][0]);
				bad.html($data[1][1]);
			})
		}
	}
}());