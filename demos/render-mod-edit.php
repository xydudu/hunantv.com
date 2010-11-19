<?php

$d = $_POST['degree']==1 ? '没学历' : '本科';
echo '{
    "err": 0, 
    "data": {
        "name": "'. $_POST['name'] .'", 
        "degree": {
            "id": "'. $_POST['degree'] .'",
            "name": "'. $d .'"}
    }
}';
?>
