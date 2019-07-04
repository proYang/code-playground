
/**
 * 
实现输出
 k = 1 ===>  ()
 k = 2 ===>  (())()()
 k = 3 ===>  ((()))  ()(()) ....()()()
 的一个函数
 */


const K = 3;
let result = [];
function print (str = '', n, left = 0, right = 0) {
  if(left === right && str.length === 2 * n) {
    result.push(str);
    return;
  }
  // 左括号数目 小于 右括号数目  || 左右括号数目等于 2 * n
  if (left < right || left + right >= 2 * n) return;
  let index = left + right;
  let strArr = str.split('');
  strArr[index] = '(';
  print(strArr.join(''), n, left + 1, right);
  strArr[index] = ')';
  print(strArr.join(''), n, left, right + 1);
}

print('', K);

console.log(result);