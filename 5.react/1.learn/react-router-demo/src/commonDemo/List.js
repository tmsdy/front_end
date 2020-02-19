import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default (props) => {
    let [id, setId] = useState(0)
    let [list, setList] = useState([])
    useEffect(() => {
        setId(props.match.params.id)
        setList([
            {
                cid: 111,
                title: '标题111'
            },
            {
                cid: 222,
                title: '标题222'
            },
            {
                cid: 333,
                title: '标题333'
            },
        ])
        // console.log()
    }, [])

    return (
        <div>
            <ul>
                路由传值：{id}
                {
                    list.map(item => {
                        return (
                            <li key={item.cid}>
                                <Link to={'/list/' + item.cid}>{item.title}</Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}