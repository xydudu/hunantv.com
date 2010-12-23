<?php
if($_POST['page']==0){
echo '{
    "err": 0,
    "data": {
            "album_id": "'.$_POST['album_id'].'",
            "uid": "1",
            "album_name": "这里是相册名 可以编辑",
            "photo_id": "0",
            "album_cover": "'.$_POST['page'].'",
            "created_time": "2010-12-18 00:00:00",
            "last_update_time": "2010-11-25 17:34:10",
            "photo_count": "19",
            "comment_count": "4294967295",
       		"total": "5",
            "list": [
            {
                "photo_id": "1",
                "photo_name": "相片名称1",
                "photo_des": "相片描述1",
                "photo_key": "KEY",
                "is_cover": false
            },
            {
                "photo_id": "2",
                "photo_name": "相片名称2",
                "photo_des": "相片描述2",
                "photo_key": "KEY",
                "is_cover": true
            },
            {
                "photo_id": "3",
                "photo_name": "相片名称3",
                "photo_des": "相片描述3",
                "photo_key": "KEY",
                "is_cover": false
            },
            {
                "photo_id": "4",
                "photo_name": "相片名称4",
                "photo_des": "相片描述4",
                "photo_key": "KEY",
                "is_cover": false
            }]
    }
}';
}elseif($_POST['page']==1){
echo '{
    "err": 0,
    "data": {
            "album_id": "'.$_POST['album_id'].'",
            "uid": "1",
            "album_name": "'.$_POST['album_id'].'",
            "photo_id": "0",
            "album_cover": "'.$_POST['page'].'",
            "created_time": "2010-12-18 00:00:00",
            "last_update_time": "2010-11-25 17:34:10",
            "photo_count": "19",
            "comment_count": "4294967295",
       		"total": "5",
            "list": [
            {
                "photo_id": "1",
                "photo_name": "相片名称1",
                "photo_des": "相片描述1",
                "photo_key": "KEY",
                "is_cover": false
            }]
    }
}';	
}
?>