import React, { useEffect } from 'react';

export default (props) => {
    //请写出输出内容
    async function async_print() {
        async function async1() {
            console.log('2.async1 start');
            await async2(); // 里面是new Promise
            console.log('6.async1 end'); //这里相当于Promise.then里的
        }
        async function async2() { // 
            console.log('3.async2');
        }

        console.log('1.script start');

        setTimeout(function () {
            console.log('8.setTimeout');
        }, 0)

        async1();

        new Promise(function (resolve) {
            console.log('4.promise1');
            resolve();
        }).then(function () {
            console.log('7.promise2');
        });
        console.log('5.script end');
    }


    useEffect(() => {
        async_print()
    }, [])

    return (
        <div>
            class
        </div>
    )
}
