/**
 * 必须要react和react-dom 16.7以上
 */

import React, { useState, useEffect } from 'react'

/*
hooks
  1.给函数组件可以操作state、使用生命周期的能力
  2.意义是让我们拆分在组件内部的逻辑，提取出来以后给更多的组件复用
*/
export default () => {
  const [name, setName] = useState('jokcy')

  useEffect(() => { //每次组件更新都走这里
    console.log('component update')

    return () => { //相当于componentUnMounted
      console.log('unbind')
    }
  }, []) //加了[]就只走一次

  return (
    <>
      <p>My Name is: {name}</p>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
    </>
  )
}
