import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString
} from 'graphql'
import Mock from 'mockjs';
Mock.mock('/graphql/articleList', {
  'list|6-15':[{
    'id|+1': 0,
    'title': '@title',
    'source': '@domain',
    'authorId': '@integer(0,10)'
  }]
});

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'article',
    fields: {
      id: { type: GraphQLInt },
      title: { type: GraphQLString },
      source: { type: GraphQLString },
      authorId: { type: GraphQLInt }
    }
  })
});

export default schema