import React, { Component } from 'react'

export default class Counter extends Component {
    state = {
        number: 0
    }

    render() {
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={() => {
                    console.log('click')
                    this.setState({
                        number: this.state.number + 1
                    })
                }}>number加一</button>
            </div>
        )
    }
}