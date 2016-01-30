<!DOCTYPE html>
<html>
<head>
	<title>书籍管理</title>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
	<div class="login">
	<form method="POST" action="index.php">
	用户名：<input name="username" type="text"><br><br/>
	密&nbsp&nbsp&nbsp&nbsp码：<input name="password" type="password"><br><br/>  
	<input id="buttonl" type="submit" name="submit" value="登录">
	<input id="buttonr" type="reset" value="重置"><br><br/>
	<a href="creat.php">立即注册</a>
	</div>
</form>
<?php
	//连接数据库
	try {
	$pdo = new PDO("mysql:host=localhost;dbname=test","root","");
	} catch (Exception $e) {
		die("数据库连接失败".$e->getMessage());
	}
	// 指定编码方式
	$pdo->query("SET NAMES UTF8");
	//验证用户名及密码加密
	@$username=$_POST['username'];
	@$password=md5($_POST['password']).md5($_POST['username']);
	$sql = "SELECT * FROM user WHERE username LIKE '$username' ";
	$result=$pdo->query($sql);
	foreach($result as $row) {
				if ($row['username']==$username) {
					if ($row['password']==$password) {		echo "<script>window.location='menu.php';</script>";}
						 else {		echo "<script>alert('密码错误');</script>";} }
				else{
					echo "<script>alert('用户名不存在');</script>";
				}
		}
?>
</body>
</html>