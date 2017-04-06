var numElements = 20;
var myNums = new CArray(numElements);
myNums.setData();
console.log(myNums.selectionSort());
console.log(myNums.dataStore);



function selectionSort() {
    var min, temp;
    for (var outer = 0; outer <= this.dataStore.length-2; ++outer) {
        min = outer;
        for (var inner = outer + 1;
             inner <= this.dataStore.length-1; ++inner) {
            if (this.dataStore[inner] < this.dataStore[min]) {
                min = inner;
            }
            swap(this.dataStore, outer, min);
        }
    }
}


















function CArray(numElements) {
    this.dataStore = [];
    this.pos = 0;
    this.numElements = numElements;
    this.insert = insert;
    this.toString = toString;
    this.clear = clear;
    this.setData = setData;
    this.swap = swap;
    this.selectionSort = selectionSort;
    for ( var i = 0; i < numElements; ++i ) {
        this.dataStore[i] = i;
    }
}
function setData() {
    for ( var i = 0; i < this.numElements; ++i ) {
        this.dataStore[i] = Math.floor(Math.random() * (this.numElements + 1));
    }
    return this
}
function clear() {
    for ( var i = 0; i < this.dataStore.length; ++i ) {
        this.dataStore[i] = 0;
    }
    return this
}
function insert(element) {
    this.dataStore[this.pos++] = element;
    return this
}
function toString() {
    var restr = "";
    for ( var i = 0; i < this.dataStore.length; ++i ) {
        restr += this.dataStore[i] + " ";
        if (i > 0 & i % 10 == 0) {
            restr += "\n";
        }
    }
    return restr;
}
function swap(arr, index1, index2) {
    var temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
    return this
}