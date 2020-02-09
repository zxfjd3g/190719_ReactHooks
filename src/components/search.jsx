import React, { useRef } from 'react'
import PubSub from 'pubsub-js'

export default function () {

  const inputRef = useRef(null)

  function search () {
    // 得到输入
    const searchName = inputRef.current.value.trim()
    if(searchName) {

      // 发布消息(search)
      PubSub.publish('search', searchName)

      inputRef.current.value = ''
    }
  }

  return (
    <section className="jumbotron">
      <h3 className="jumbotron-heading">Search Github Users</h3>
      <div>
        <input type="text" placeholder="enter the name you search" ref={inputRef}/>
        <button onClick={search}>Search2</button>
      </div>
    </section>
  )
}