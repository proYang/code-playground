// 输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字，例如，如果输入如下4 X 4矩阵： 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 则依次打印出数字1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10.
// 分析 
/**
 * 
 * 例如


 1 2 3


 4 5 6


 7 8 9


 输出并删除第一行后， 再进行一次逆时针旋转， 就变成：


 6 9


 5 8


 4 7


 继续重复上述操作即可
 */
function printMatrix(matrix) {
  // write code here
  const queue = [];
  function readMatrix(matrix) {
    let index = 0;
    let row = matrix[0];
    while (index < row.length) {
      queue.push(row[index])
      index++;
    }
    // 删除第一行
    matrix.splice(0, 1);
    // 没有元素
    if (matrix.length === 0) return;
    
    let newMatrix = [];
    for (let i = matrix[0].length - 1; i >= 0; i--) {
      // 访问最后一列
      let tempRow = [];
      for (let j = 0; j < matrix.length; j++) {
        tempRow.push(matrix[j][i])
      }
      newMatrix.push(tempRow);
    }
    readMatrix(newMatrix);
  }

  readMatrix(matrix)
  queue.forEach(item => console.log(item));
}

printMatrix([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]])