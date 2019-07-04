/**
 * 我们可以用2 * 1 的小矩形横着或者竖着去覆盖更大的矩形。 
 * 请问用n个2 * 1 的小矩形无重叠地覆盖一个2 * n的大矩形， 总共有多少种方法？
 */
/**
 * 分析
 * 2 * 1  --->   2 * n
 * n == 1 --->  1
 * n == 2-- - > 2
 * n == 3-- - > f(3 - 1) + f(3 - 2)
 * n == n --->  f(n - 1)+ f(n - 2)
 * 
 * 可以从第一次开始进行分类；注意此处是2*2格子时处理方式只有一种：f[i-2]
 */
function rectCover(number) {
	// write code here
	let arr = [0, 1, 2];
	let i = 3;
	while (i <= number) {
		arr[i] = arr[i - 1] + arr[i - 2];
		i++
	}
	return arr[number];
}