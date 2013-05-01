<?php 

header('Access-Control-Allow-Origin: http://web.mit.edu'); 
//include 'json_encode.php';

// filename should be <facebookid>.rdf written to the rdf directory
$posts = $_POST['rdfstring'];
$fileName = $_POST['fileName'];
$directory = dirname(__FILE__);
$fileNameToWrite = $directory . "/../../www/linkedinsight/musicfoafiles/" . $fileName;

$fp = fopen($fileNameToWrite, 'w');
if ($fp) {
	if (fwrite($fp, $posts) == FALSE) {
		echo "Cannot write file ($fileNameToWrite)";
	}
	else {
		echo $fileNameToWrite;
	}
}
else
{
	echo "Cannot open file ($fileNameToWrite)";
}
fclose($fp);

?> 