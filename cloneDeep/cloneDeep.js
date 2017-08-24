function cloneDeep(target) {
  let node;
  if (Array.isArray(target)) {
    node = target.length > 0 ? target.slice(0) : []
    node.forEach((e, i) => {
      if ((Array.isArray(e) && e.length > 0) || typeof e === "object") {
        node[i] = cloneDeep(e)
      }
    });
  } else if (typeof target === "object") {
    node = Object.assign({}, target);
    Object.keys(node).forEach((key) => {
      if ((Array.isArray(node[key]) && node[key].length > 0) || typeof node[key] === "object") {
        node[key] = cloneDeep(node[key])
      }
    })
  } else node = target
  return node
}

module.exports = cloneDeep