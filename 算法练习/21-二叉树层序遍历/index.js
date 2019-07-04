//从上往下打印出二叉树的每个节点，同层节点从左至右打印。
/* function TreeNode(x) {
    this.val = x;
    this.left = null;
    this.right = null;
} */
function PrintFromTopToBottom(root) {
  // write code here
  // 使用队列
  let queue = [];
  let result = [];

  if (root === null) return [];
  queue.push(root);
  while(queue.length > 0) {
    let node = queue.shift();
    if (node.left) {
      queue.push(node.left);
    }
    if (node.right) {
      queue.push(node.right);
    }
    result.push(node.val);
  }
  return result
}