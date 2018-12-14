import React from 'react';
import './person.css' ;

const person = ( props )=>{
    return (
        <div className="person-item">
            <p onClick={props.myclick}>大家好，我是{props.name}!我已经有{props.count}个作品 </p>
            <p>{props.children}</p>
            <input type="text" onChange={props.change_input} defaultValue={props.name} />
        </div>
    )
}

export default person ;