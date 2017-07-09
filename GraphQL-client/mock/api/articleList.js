import Mock from 'mockjs';

Mock.mock('/graphql/articleList', {
  'list|6-15':[{
    'id|+1': 0,
    'title': '@title',
    'source': '@domain',
    'authorId': '@integer(0,10)'
  }]
});