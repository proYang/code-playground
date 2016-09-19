//引入mysql模块
const mysql = require('mysql');


let connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'test', // 前面建的user表位于这个数据库中
    port: 3306
});

connection.connect(function (err) {
    if (err) {
        console.log("连接失败" + err);
    } else {
        console.log('连接成功！');
    }
});

connection.query('select * from test where id = 2', function (err, res){
    if (err){
        console.log(err);
    }
    if (res){
            // console.log("%d\t%s\t%s", rows[i].id, rows[i].name);
        console.log('id:' + res[0].id + '\nname:' + res[0].name);
    }
});

// connection.release();

connection.end(function (err) {
    console.log('连接关闭');
})
