<?php
$response = array(
    'err' => 0,
    'data' => $_GET['data']    
);  
echo json_encode($response);
?>
