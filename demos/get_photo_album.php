<?php
if($_POST['uid']==18&&$_POST['page']==0){
echo '{
    "err": 0,
    "data": {
		"total":3,
        "album": [
			{
				"album_id": "1",
				"uid": "1",
				"album_name": "这是测试相册",
				"photo_id": "18",
				"album_cover": "cover_key",
				"created_time": "2010-12-18 00:00:00",
				"last_update_time": "1小时",
				"photo_count": "16",
				"comment_count": "12",
				"photoes":[
					{
						"photo_id": "27",
						"photo_name": "\u76f8\u518c\u6587\u4ef6\u540d",
						"photo_key": "KEY"
					},
					{
						"photo_id": "26",
						"photo_name": "\u76f8\u518c\u6587\u4ef6\u540d",
						"photo_key": "KEY"
					},
					{
						"photo_id": "25",
						"photo_name": "\u76f8\u518c\u6587\u4ef6\u540d",
						"photo_key": "KEY"
					}
				]
			}
        ],
        "self": true
    }
}';
}elseif($_POST['uid']==18&&$_POST['page']==1){
sleep(1);
echo '{
    "err": 0,
    "data": {
		"total":3,
        "album": [
			{
				"album_id": "2",
				"uid": "1",
				"album_name": "这是测试相册三",
				"photo_id": "18",
				"album_cover": "cover_key",
				"created_time": "2010-12-18 00:00:00",
				"last_update_time": "二天",
				"photo_count": "16",
				"comment_count": "22",
				"photoes":[
					{
						"photo_id": "27",
						"photo_name": "\u76f8\u518c\u6587\u4ef6\u540d",
						"photo_key": "KEY"
					},
					{
						"photo_id": "26",
						"photo_name": "\u76f8\u518c\u6587\u4ef6\u540d",
						"photo_key": "KEY"
					},
					{
						"photo_id": "25",
						"photo_name": "\u76f8\u518c\u6587\u4ef6\u540d",
						"photo_key": "KEY"
					}
				]
			},
			{
				"album_id": "3",
				"uid": "1",
				"album_name": "这是测试相册四",
				"photo_id": "18",
				"album_cover": "cover_key",
				"created_time": "2010-12-18 00:00:00",
				"last_update_time": "1小时",
				"photo_count": "16",
				"comment_count": "157",
				"photoes":[
					{
						"photo_id": "27",
						"photo_name": "\u76f8\u518c\u6587\u4ef6\u540d",
						"photo_key": "KEY"
					},
					{
						"photo_id": "26",
						"photo_name": "\u76f8\u518c\u6587\u4ef6\u540d",
						"photo_key": "KEY"
					},
					{
						"photo_id": "25",
						"photo_name": "\u76f8\u518c\u6587\u4ef6\u540d",
						"photo_key": "KEY"
					}
				]
			}
        ],
        "self": true
    }
}';
}else{
echo '{"err":1,"data":{"self": true}}';
}
?>