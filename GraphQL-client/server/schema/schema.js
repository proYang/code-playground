import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} from 'graphql'
// 获取数据接口
import { fetchArticleList, fetchAuthorList } from '../mockServer/mockServer'

// 文章Type
const articleType = new GraphQLObjectType({
  name: "article",
  description: "article",
  fields: {
    id: {
      type: GraphQLString,
      description: "article id",
      resolve: article => article.id
    },
    title: {
      type: GraphQLString,
      description: "article title",
      resolve: article => article.title
    },
    source: {
      type: GraphQLString,
      description: "article price",
      resolve: article => article.source
    },
    authorId: {
      type: GraphQLString,
      description: "item pic url",
      resolve: article => article.authorId
    }
  }
})

// 作者Type
const authorType = new GraphQLObjectType({
  name: "author",
  description: "author",
  fields: {
    id: {
      type: GraphQLString,
      description: "author id",
      resolve: author => author.id
    },
    name: {
      type: GraphQLString,
      description: "author name",
      resolve: author => author.name
    }
  }
})

// 查询Type
const QueryType = new GraphQLObjectType({
  name: 'query',
  fields: {
    articleList: {
      type: new GraphQLList(articleType),
      resolve: (root, args, ctx) => fetchArticleList().then((res)=>res.list),
    },
    authorList: {
      type: new GraphQLList(authorType),
      resolve: (root, args, ctx) => fetchAuthorList().then((res)=>res.list),
    },
  },
})
const schema = new GraphQLSchema({
  query: QueryType
})

export default schema