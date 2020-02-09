import React, {useState, useEffect} from 'react'
import axios from 'axios'
import PubSub from 'pubsub-js'

export default function Main () {

  const [firstView, setFirstView] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => {
    // 订阅消息(search)
    PubSub.subscribe('search', async (msgName, searchName) => {
      // 更新状态(请求中)
      setFirstView(false)
      setLoading(true)
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
        setUsers(users)
        setLoading(false)
      } catch (e) {
        // 失败了, 更新状态(失败)
        setErrorMsg('请求出错!')
        setLoading(false)
      }
    })
  }, [])

  if(firstView) {
    return <h2>请输入关键字进行搜索</h2>
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
