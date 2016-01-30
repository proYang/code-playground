
<!DOCTYPE html>
<html>
<head>
	<title>查找</title>
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
	<div id="search">
	<form action="searchba.php" method="POST">
		<div>请输入作者:</div>
		<input type="text" name="search">
		<input type="submit" value="搜索">
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
			// 搜索并输出
			@$search = $_POST['search'];
			if ($search) {
				$sql = "SELECT * FROM booklist WHERE author LIKE'%$search%' ";
				$result = $pdo->query($sql);
				foreach ($result as $row) {
				echo "<div id='content'>";
				echo "<h4>《{$row['bookname']}》</h4>";
				echo "<span>——{$row['author']}</span>";
				echo "<p>{$row['content']}</p>";
				echo "<div>定价：￥<span>{$row['price']}</span>元</div>";
				echo "</div>";}
			}
		?>

</div>

</div>
</body>
</html>
