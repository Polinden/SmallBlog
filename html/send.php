<?php

header('Content-Type: text/html; charset=utf-8'); 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require('../config/options.php');
require('couchdb.php');


session_start();

if(!isset($_SESSION['username'])){ 
    header('Location: login.php'); exit;
}

$uploaddir = $options['datadir'];
$newid=str_replace(".", "", uniqid('', true));
$fext="." . pathinfo($_FILES['pic']['name'], PATHINFO_EXTENSION);
$uploadfile = $uploaddir . $newid . $fext;
$file_to_show=str_replace($options['datadir'], "", $uploadfile);

if (!move_uploaded_file($_FILES['pic']['tmp_name'], $uploadfile)) {
    $file_to_show="pic1.jpg";
}
else {
chmod($uploadfile, 0777);
}

$obj = new class{};
$obj->dish= $_POST['dish'];
$obj->author= $_SESSION['username'];
$obj->auth_name= $_SESSION['usersurname'];
$obj->short=urlencode($_POST['short']);
$obj->work=new class{};
$obj->work->ingr=urlencode($_POST['ingr']);
$obj->work->recipe=urlencode($_POST['recipe']);
$obj->work->link=$_POST['link'];
$obj->work->mark="4";
$obj->work->date=$_POST['date'];
$obj->work->photo=$file_to_show;

$reqv=json_encode($obj);

$couch=new CouchSimple($options);
$resp = $couch->send("PUT", "/cookbook/" . $newid, $reqv);

header('Location: index.html'); exit;
?>
