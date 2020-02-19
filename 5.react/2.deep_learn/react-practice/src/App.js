import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import routes from './routes'

class App extends Component {
    render() {
        return (
            <div className="App">
                <nav className="navs">
                    <Link to="/ref">Ref</Link>
                    <Link to="/forward-ref">ForwardRef</Link>
                    <Link to="/context">Context</Link>
                    <Link to="/concurrent">ConcurrentMode</Link>
                    <Link to="/suspense">Suspense</Link>
                    <Link to="/hooks">Hooks</Link>
                    <Link to="/children">Children</Link>
                    <Link to="/portal">createPortal</Link>
                    <br />
                    <Link to="/control_comp">双向绑定</Link>
                </nav>
                <div className="contents">{routes}</div>
            </div>
        )
    }
}

export default App
