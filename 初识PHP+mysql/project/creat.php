<!DOCTYPE html>
<html>
<head>
	<title>注册</title>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<div class="creat">
	<form action="creat.php" method="post">  
    &nbsp&nbsp&nbsp用户名:<input type="text" name="username"/>  
    <br/><br/> 
    &nbsp&nbsp密&nbsp&nbsp&nbsp&nbsp&nbsp码:<input type="password" name="password"/>  
    <br/><br/> 
    确认密码:<input type="password" name="confirm"/>  
    <br/><br/> 
    <input id="buttonc" type="Submit" name="Submit" value="注册"/>  
	</form>
</div>
	<?php
	//连接数据库
	try {
	$pdo = new PDO("mysql:host=localhost;dbname=test","root","");
	} catch (Exception $e) {
		die("数据库连接失败".$e->getMessage());
	}
	// 指定编码方式
	$pdo->query("SET NAMES UTF8");
	//获取用户名并加密密码
	@$username=$_POST['username'];
	@$password=md5($_POST['password']).md5($_POST['username']);
	@$confirm=md5($_POST['confirm']).md5($_POST['username']);
	if ($username&&$password&&$confirm) {
		if ($password==$confirm) {
			$sql = "INSERT INTO user (username,password) VALUES ('$username','$password')";
			$result=$pdo->query($sql);
			if ($result) {
				echo "<script>alert('注册成功')</script>";
				echo "<script>window.location='index.php';</script>";
			}
			else{
				echo "<script>alert('注册失败')</script>";
			}
		}else{
			echo "<script>alert('密码不一致')</script>";
		}
	}
	?>
</body>
</html>