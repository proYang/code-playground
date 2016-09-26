/**
 * Created by Slane on 2016/9/26.
 * 文件重命名
 */
const fs = require('fs');

let src = 'text/'

fs.readdir(src, function(err, files) {
    if (err) throw err;
    files.forEach(function (filename) {
        let newPath = src + filename.replace('hello', 'data');
        let oldPath = src + filename;
        fs.rename(oldPath, newPath, function (err) {
            if (err) throw  err;
            console.log(filename + "    替换成功");
        });
    })
});