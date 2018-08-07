// DOM数组统一遍历方法
const each = (arrLike, fn) => {
  for (var i = 0; i < arrLike.length; i++) {
    fn(arrLike[i], i, arrLike);
  }
};

const indexOf = [].indexOf;
const slice = [].slice;

export default function getObserver(selector) {
  var target;
  var config = { 
    attributes: true, // 观察目标节点的属性节点(新增或删除了某个属性,以及某个属性的属性值发生了变化)
    childList: true, // 观察目标节点的子节点的新增和删除。
    characterData: true // 如果目标节点为characterData节点(一种抽象接口,具体可以为文本节点,注释节点,以及处理指令节点)时,也要观察该节点的文本内容是否发生变化
  };
  var prevNodes = []; // 前一次所有节点

  var observer = new MutationObserver(function(mutations) {
    var allNodes = target.childNodes;
    var addedNodes = [];
    //console.log(selector, prevNodes);
    mutations.forEach(function(mutation) {
      observer.disconnect(); // 暂停变化监听
      if (mutation.type === "childList") {
        // 被添加的节点
        each(mutation.addedNodes, node => addedNodes.push(node));
      }
    });
    observer.disconnect();
    each(prevNodes, node => {
      node.classList.toggle("inserted", false);
      node.classList.toggle("moved", false);
      node.classList.toggle("old", true);
      node.classList.toggle("lcs", true);
    });
    each(addedNodes, node => {
      if (indexOf.call(prevNodes, node) < 0) {
        // 上次节点中不存在这个节点，标记为插入
        node.classList.toggle("inserted", true);
      } else {
        // 上次节点中存在这个节点，标记为移动
        node.classList.toggle("moved", true);
        node.classList.toggle("lcs", false);
      }
    });
    prevNodes = slice.call(allNodes);
    // 继续观察
    observer.observe(target, config);
  });

  return function observeDiffs() {
    target = document.querySelector(selector);
    observer.observe(target, config);
  };
}
