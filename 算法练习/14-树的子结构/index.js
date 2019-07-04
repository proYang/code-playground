// 输入两棵二叉树A，B，判断B是不是A的子结构。（ps：我们约定空树不是任意一个树的子结构）
/* function TreeNode(x) {
    this.val = x;
    this.left = null;
    this.right = null;
} */
// 中序遍历
function HasSubtree(pRoot1, pRoot2) {
	// write code here
	if (pRoot2 === null) return false;
	if (pRoot1 === null) return false;

	isSubTree = (parent, child) => {
		// 最后一个节点相等
		if (child === null) return true;
		if (parent === null) return false;
		if (parent.val === child.val) {
			return isSubTree(parent.left, child.left) && isSubTree(parent.right, child.right);
		} else {
			return false;
		}
	}

	let isSub = false;
	if (pRoot1.val === pRoot2.val) {
		isSub = isSubTree(pRoot1, pRoot2)
	}
	if (!isSub) {
		// 左子树
		isSub = HasSubtree(pRoot1.left, pRoot2)
	}
	if (!isSub) {
		// 右子树
		isSub = HasSubtree(pRoot1.right, pRoot2)
	}
	return isSub;
}