/**
 * 必须要react和react-dom 16.7以上
 */

import React, { useState, useEffect } from 'react'

/*
hooks
  1.给函数组件可以操作state、使用生命周期的能力
  2.意义是让我们拆分在组件内部的逻辑，提取出来以后给更多的组件复用
*/
export default () => { //相当于componentDidmount
    const [name, setName] = useState('jokcy') //hooks需要写在函数最外层

    useEffect(() => {
        console.log('component update')//每次组件更新都走这里，mounted也走这里了，没做区分

        return () => { //相当于componentUnMounted
            console.log('unbind')
        }
    }, []) //加了[]就只走一次,如果是[name]代表当name改变时才走useEffect里面

    return (
        <>
            <p>My Name is: {name}</p>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </>
    )
}
