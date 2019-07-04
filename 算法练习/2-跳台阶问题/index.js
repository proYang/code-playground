/**
 * 一只青蛙一次可以跳上1级台阶， 也可以跳上2级。 求该青蛙跳上一个n级的台阶总共有多少种跳法（ 先后次序不同算不同的结果）。
 */
/*
分析：最后一次跳台阶，如果是两级，则前面有f(n-2)种跳法，如果是1级，则前面有f(n-1)种跳法
所以：f(n)=f(n-1)+f(n-2);f(1)=1;f(2)=2;
*/
function jumpFloor(number) {
	if (number === 1) return 1;
	if (number === 2) return 2;
	return jumpFloor(number - 1) + jumpFloor(number - 2)
}

function jumpFloor(number) {
	let arr = [1, 2];
	let i = 2;
	while (i <= number) {
		arr[i] = arr[i - 1] + arr[i - 2];
		i++;
	}
	return arr[number - 1];
}