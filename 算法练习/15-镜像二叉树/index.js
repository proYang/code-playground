/* function TreeNode(x) {
    this.val = x;
    this.left = null;
    this.right = null;
} */
/**
 二叉树的镜像定义：源二叉树 
    	    8
    	   /  \
    	  6   10
    	 / \  / \
    	5  7 9 11
    	镜像二叉树
    	    8
    	   /  \
    	  10   6
    	 / \  / \
    	11 9 7  5
 */
function Mirror(root) {
  // write code here
  if(root === null) return;
  let node = root.left;
  [root.right, root.left] = [root.left, root.right];
  Mirror(root.left)
  Mirror(root.right)
}