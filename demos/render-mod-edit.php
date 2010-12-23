<?php

$degree = $_POST['degree']==1 ? '没学历' : '本科';
$sex = $_POST['sex']==0 ? '男' : '女';
//save
$interest='';
$interest_id=array();
$interest_value='';
if(isset($_POST['interest'])){
	$interest=$_POST['interest'];
	foreach($interest as $value){
		$d=explode('|',$value);
		array_push($interest_id, $d[0]);	
		$interest_value.=$d[1].' ';
	}
}
//处理多选框
echo '{
    "err": 0, 
    "data": {
        "name": "'. $_POST['name'] .'", 
        "degree": {
            "id": "'. $_POST['degree'] .'",
            "value": "'. $degree .'"
		}, 
        "interest": {
            "id": '. json_encode($interest_id) .',
            "value": "'. trim($interest_value) .'"
    	}, 
        "sex": {
            "id": "'. $_POST['sex'] .'",
            "value": "'. $sex .'"
        },
        "live_province_id": {
            "id": "'. $_POST['live_province'] .'",
            "value": ""
        },

        "live_city_id": {
            "id": "'. $_POST['live_city'] .'",
            "value": ""
        }
    }
}';
?>
