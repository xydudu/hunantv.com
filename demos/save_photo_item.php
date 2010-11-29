<?php
$i=rand(1,1);
if($i==0){
	echo '{"err":1,"data":{"id":29,"key":"'.$_POST['photo_key'].'","des":"'.$_POST['photo_name'].'"}}';
}else{
	echo '{"err":0,"data":{"id":'.rand(100,999).',"key":"'.$_POST['field']['data']['photo_key'].'","des":"'.$_POST['field']['data']['photo_name'].'"}}';
}
?>