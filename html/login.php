<?php

include('couchdb.php');
include('../config/options.php');

session_start();
unset($_SESSION['username']);
$nv=false;
$dm=false;
if(isset($_POST['submit']))
{
    $username=htmlspecialchars(trim($_POST['username']));
    $password=htmlspecialchars(trim($_POST['password']));
    if($username&&$password)
    {
         $temp1='{"selector" : {"' . $username. '" : {"$eq" : "' . $password .'" }}}';
         $couch=new CouchSimple($options);
         $resp = $couch->send("POST", "/users/_find", $temp1);
         $rf=json_decode($resp);
         $fr=count($rf->docs);
         if($fr!=0)
            {
                $_SESSION['username']=$username;
                if (is_null(($rf->docs)[0]->name)) {$sn="Anonimous";}
                else {$sn=($rf->docs)[0]->name;}

                $_SESSION['usersurname']=$sn;  
                $_SESSION['username']=$username;     
                header ('Location: index.html');
    
            }else $nv=true;
     }else $dm=true;
}
?>


<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
</head>
<style>

body {
  margin: 0;
  padding: 0;
  background-color: #17a2b8;
  height: 100vh;
}
#login .container #login-row #login-column #login-box {
  margin-top: 120px;
  max-width: 600px;
  height: 320px;
  border: 1px solid #9C9C9C;
  background-color: #EAEAEA;
}
#login .container #login-row #login-column #login-box #login-form {
  padding: 20px;
}
#login .container #login-row #login-column #login-box #login-form #register-link {
  margin-top: -85px;
}

</style>

<body>

    <div id="login">
        <h3 class="text-center text-white pt-5">Login form</h3>
        <div class="container">
            <div id="login-row" class="row justify-content-center align-items-center">
                <div id="login-column" class="col-md-6">
                    <div id="login-box" class="col-md-12">
                        <form id="login-form" class="form" action="" method="post">
                            <h3 class="text-center text-info">Login</h3>
                            <div class="form-group">
                                <label for="username" class="text-info">Username:</label><br>
                                <input type="text" name="username" id="username" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="password" class="text-info">Password:</label><br>
                                <input type="text" name="password" id="password" class="form-control">
                            </div>
                            <div class="form-group">
                                <input type="submit" name="submit" class="btn btn-info btn-md" value="submit">
                            </div>
                            <?php
                             if ($dm) { 
                               echo '<label class="text-info"> fill the form </label>';  
                             };
                             if ($nv) { 
                                echo '<label class="text-info"> wrong password </label>'; 
                             };
                            ?>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>


</body>
</html>
