import React, { useEffect, useState } from 'react';

export default (props) => {

    useEffect(() => {
        let arr = [1, [2, [3, 4]]]
        console.log(arr.flat(Infinity))
    }, [])

    return (
        <div>
            123
        </div>
    )
}