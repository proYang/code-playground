import Mock from 'mockjs';

Mock.mock('/graphql/authorList', {
  'authorList|15':[{
    'id|+1': 0,
    'name': '@name'
  }]
});