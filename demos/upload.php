<?php
	if (isset($_FILES["resume_file"]) && is_uploaded_file($_FILES["resume_file"]["tmp_name"]) && $_FILES["resume_file"]["error"] == 0) {
		echo rand(1000000, 9999999);	// Create a pretend file id, this might have come from a database.
	} else {
		echo '{"err":0,"data":{"photo_name":"'.$_FILES['Filedata']['name'].'","photo_key":"4cee17edee9fb","width":500,"height":400}}'; // I have to return something or SWFUpload won't fire uploadSuccess
	}
?>