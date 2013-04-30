<?php 

header('Access-Control-Allow-Origin: http://web.mit.edu'); 
include 'json_encode.php';

//$sql=mysql_query("select * from Posts limit 20"); 

// $result=mysql_query($sql);
// while($row=mysql_fetch_array($result)) 
// { 
// $title=$row['title']; 
// $url=$row['url']; 

// $posts[] = array('title'=> $title, 'url'=> $url);

// } 

$posts = $_POST['posts'];
$fileName = $_POST['fileName'];

$fp = fopen($fileName, 'w');
fwrite($fp, json_encode($posts));
fclose($fp);

?> 