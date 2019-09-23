import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'

export default (props) => {

    useEffect(() => {
        // props.history.push('/home/') //手动重定向
    }, [])

    return (
        <div>
            {/* 一进来index就重定向到/home/下 */}
            {/* <Redirect to="/home/"></Redirect> */}
            index
        </div>
    )
}