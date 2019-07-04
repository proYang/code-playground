/**
 * 
输入一个整数， 输出该数二进制表示中1的个数。 其中负数用补码表示。
 */

function NumberOf1(n) {
	// write code here
	if (n < 0) {
		// 计算补码
		n = Math.pow(2, 32) + n;
	}
	let string = (n).toString(2);
	const stringArr = string.split('');
	let i = 0;
	stringArr.forEach(item => {
		if (Number(item) === 1) {
			i++
		}
	})
	return i
}