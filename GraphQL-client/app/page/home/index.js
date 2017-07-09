import './index.css'
import tpl from './index.hbs'
import axios from 'axios'

class Main {

  constructor() {
    this.getIndexList().then(res => {
      this.render(res, tpl)
    })
  }

  render(context, template) {
    // 渲染数据到页面
    document.querySelector('#app').innerHTML = template(context);
  }

  async getIndexList() {
    let articleList = await this.fetchArticleListAsync()
    let authorList = await this.fetchAuthorListAsync()
    // 合并文章列表与作者数据
    for (let i = 0; i < articleList.length; i++) {
      let authorId = articleList[i].authorId
      for (var j = 0; j < authorList.length; j++) {
        // 作者id相同
        if (authorList[j].id == authorId) {
          articleList[i].author = Object.assign({}, authorList[j])
          break
        }
      }
    }
    return { list: articleList }
  }

  fetchArticleListAsync() {
    return axios.get("/graphql/articleList").then((res) => res.data.list)
  }

  fetchAuthorListAsync() {
    return axios.get("/graphql/authorList").then((res) => res.data.list)
  }
}

new Main()
