<?php
$response = array(
    'err' => 1,
    'data' => $_POST['data']    
);  
sleep(11);
echo json_encode($response);
?
