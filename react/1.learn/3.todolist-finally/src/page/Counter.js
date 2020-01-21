import React from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getAddCountAction } from '../action/actionCreators'
import { Button } from 'antd'

export default (props) => {

    const countState = useSelector(state => state.count)
    const dispatch = useDispatch()

    function addCount() {
        dispatch(getAddCountAction(1))
    }

    return (
        <div className="container">
            <p >{countState.count}</p>
            <Button type="primary" onClick={addCount}>+1</Button>
        </div>
    )
}