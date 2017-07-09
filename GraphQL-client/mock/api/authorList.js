import Mock from 'mockjs';

Mock.mock('/graphql/authorList', {
  'list|15':[{
    'id|+1': 0,
    'name': '@name'
  }]
});