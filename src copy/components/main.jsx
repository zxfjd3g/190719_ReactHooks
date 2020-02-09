import React, {Component} from 'react'
import axios from 'axios'
import PubSub from 'pubsub-js'

export default class Main extends Component {

  state = {
    firstView: true,  // 是否显示第一个初始界面
    loading: false, // 是否正在请求中
    errorMsg: '', // 请求出错的提示信息
    users: [], // 需要显示的用户列表
  }

  componentDidMount () {
    // 订阅消息(search)
    PubSub.subscribe('search', async (msgName, searchName) => {
      // 更新状态(请求中)
      this.setState({
        firstView: false,
        loading: true
      })
      // 发异步ajax请求, 获取users数据
      const url = `https://api.github.com/search/users?q=${searchName}`
      try {
        const response = await axios.get(url)
        const result = response.data
        const users = result.items.map(item => ({
          name: item.login,
          avatar_url: item.avatar_url,
          url: item.html_url
        }))
        // 成功了, 更新状态(成功)
        this.setState({
          users,
          loading: false
        })
      } catch (e) {
        // 失败了, 更新状态(失败)
        this.setState({
          loading: false,
          errorMsg: '请求出错了!!!'
        })
      }
    })
  }




  render() {

    const {firstView, loading, errorMsg, users} = this.state

    if(firstView) {
      return <h2>请输入关键字进行搜索  {this.props.searchName}</h2>
    } else if (loading) {
      return <h2>正在请求中...</h2>
    } else if (errorMsg) {
      return <h2 style={{color: 'red'}}>{errorMsg}</h2>
    } else {
      return (
        <div className="row">
          {
            users.map((user, index) => ( // user对象必须有3个履性: url/avatar_url/name
              <div className="card" key={index}>
                <a href={user.url} target="_blank" rel="noopener noreferrer">
                  <img src={user.avatar_url} style={{width: 100}} alt="avatar"/>
                </a>
                <p className="card-text">{user.name}</p>
              </div>
            ))
          }
        </div>
      )
    }


  }
}