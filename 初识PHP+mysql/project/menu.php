
<!DOCTYPE html>
<html>
<head>
	<title>商品表</title>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<div class="allPage">
<div class="left">
	<a href="menu.php"><div>商品列表</div></a>
	<a href="searchbn.php"><div>按书名搜索商品</div></a>
	<a href="searchba.php"><div>按作者搜索商品</div></a>
</div>
<div class="right">
<table>
	<tr>
		<th>书籍编号</th>
		<th>书名</th>
		<th>作者</th>
		<th>价格</th>
	</tr>
	<?php
	//连接数据库
	try {
	$pdo = new PDO("mysql:host=localhost;dbname=test","root","");
	} catch (Exception $e) {
		die("数据库连接失败".$e->getMessage());
	}
	// echo $pdo->getAttribute(PDO::ATTR_CLIENT_VERSION );
	// 	print_r($pdo);
	// 指定编码方式
	$pdo->query("SET NAMES UTF8");
	// 查询并遍历数据
	$sql = "select * from booklist";
	$stm = $pdo ->query($sql);
	foreach ($stm as $row) {
		echo "<tr>";
		echo "<td>{$row['number']}</td>";
		echo "<td>{$row['bookname']}</td>";
		echo "<td>{$row['author']}</td>";
		echo "<td>{$row['price']}</td>";
		echo "</tr>";
	}
	mysqli_close($link);
?>
</table>
</div>
</div>
</body>
</html>
