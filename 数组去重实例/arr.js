function testArr() {
	var arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
		arr1 = [2, 4, 6, 8, 0],
		res = [];
	for (var i = 0; i < arr1.length; i++) {
		var obj = arr1[i];
		var isExist = true;
		for (var j = 0; j < arr2.length; j++) {
			var aj = arr2[j];
			if (aj == obj) {
				isExist = false;
				break;
			}
		}
		if (!isExist) {
			res.push(obj);
		}
	}
	console.log(res);
}
testArr();

function removeRepetition(arr) {
	var obj = {}
	var data = []
	arr.forEach(function (item) {
		if (!obj[item]) {
			obj[item] = true
			data.push(item)
		}
	})
	return data
}
var arrD = removeRepetition([1, 1, 1, 1, 2, 3, 4, 3, 2, 0])
console.log(arrD)