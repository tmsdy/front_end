import React, { useEffect } from 'react';

export default (props) => {
    function setTimeout111() {
        setTimeout(() => {
            console.log('111')
        }, 1000)
    }

    function Promise222() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('222')
            }, 1000);
        })
    }

    function Promise333() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // reject('error')
                resolve('333')
            }, 1000);
        })
    }

    async function asyncFunc() {
        try {
            let res1 = await setTimeout111() // undefined，不返回Promise的也能用，不过返回值是undefined
            let res2 = await Promise222() // 222
            let res3 = await Promise333() // 333

            console.log('res1==', res1)
            console.log('res2==', res2)
            console.log('res3==', res3)

        } catch (err) {
            console.log('err', err)
        }

    }

    useEffect(() => {
        asyncFunc()
    }, [])

    return (
        <div>
            class
        </div>
    )
}
