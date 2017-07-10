import Mock from 'mockjs'


//  模拟数据
let articleData = Mock.mock({
  'list|6-15': [{
    'id|+1': 0,
    'title': '@title',
    'source': '@domain',
    'authorId': '@integer(0,10)'
  }]
})

let authorData = Mock.mock({
  'list|15': [{
    'id|+1': 0,
    'name': '@name'
  }]
});

// 暴露获取数据api
function fetchArticleList(relativeURL) {
  return new Promise(function (resolve, reject) {
    resolve(articleData)
  });
}
function fetchAuthorList(relativeURL) {
  return new Promise(function (resolve, reject) {
    resolve(authorData)
  });
}

export {
  fetchArticleList,
  fetchAuthorList
}