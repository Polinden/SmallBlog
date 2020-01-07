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

$couch=new CouchSimple($options);

$rid=$_POST['rid'];
$rev=$_POST['rev'];
$pic=$_POST['picr'];

$obj = new class{};
$obj->_id=$rid;
$obj->todelete= $_SESSION['username'];
$obj->_rev=$rev;
$obj->_deleted=true;
$reqv=json_encode($obj);

$resp = $couch->send("PUT", "/cookbook/" . $rid, $reqv);
$obj=json_decode($resp);

   
if ($obj->ok) {
    if ($pic!='pic1.jpg') {
            unlink($options['datadir'] . $pic);
    }
}


header('Location: index.html'); exit;
?>
