/**
 * 字符串全排列
 */
function swap(arr, i, j) {
  if(i === j) return;
	let temp = arr[i]
	arr[i] = arr[j]
	arr[j] = temp
}

function calcAllPermutation(str) {
	let result = [];
	const strArr = str.split('');

	const allPermutation = (index) => {
		for (let i = index; i < strArr.length; i++) {
      // 交换位置
			swap(strArr, index, i);
			if (index === strArr.length - 1) {
        // 最后一位
				result.push(strArr.join(''))
			} else {
        // 还有一位，递归遍历
				allPermutation(index + 1)
      }
      // 复原位置
			swap(strArr, index, i);
		}
	}

  allPermutation(0);
  
  result = result.filter((str, index) => result.indexOf(str) === index);

	return result
}

console.log(calcAllPermutation('abc'))