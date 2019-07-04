// 输入两个整数序列， 第一个序列表示栈的压入顺序， 请判断第二个序列是否可能为该栈的弹出顺序。 假设压入栈的所有数字均不相等。 例如序列1, 2, 3, 4, 5 是某栈的压入顺序， 序列4, 5, 3, 2, 1 是该压栈序列对应的一个弹出序列， 但4, 3, 5, 1, 2 就不可能是该压栈序列的弹出序列。（ 注意： 这两个序列的长度是相等的）
function IsPopOrder(pushV, popV) {
  let stack = [];
  let i = 0;
  let j = 0;
  while (i < pushV.length) {
    stack.push(pushV[i])
    i++
    while (stack.length && stack[stack.length - 1] === popV[j]) {
      stack.pop()
      j++
    }
  }
  if(stack.length > 0) {
    return false
  } else {
    return true
  }
}

function IsPopOrder(pushV, popV) {
	let stack = [];
	let i = 0;
	let j = 0;
	while (i < pushV.length) {
		stack.push(pushV[i])
		i++
		while (stack.length && stack[stack.length - 1] === popV[j]) {
			stack.pop()
			j++
		}
	}
	if (stack.length > 0) {
		return false
	} else {
		return true
	}
}


console.log(IsPopOrder([1, 2, 3, 4, 5], [4, 3, 5, 1, 2]))