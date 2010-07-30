<?php
$response = array(
    'err' => 0,
    'data' => $_POST['data']    
);  
echo json_encode($response);
?>
