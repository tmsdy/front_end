import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import routes from './routes'

class App extends Component {
    render() {
        return (
            <div className="App">
                <nav className="navs">
                    <Link to="/ref">RefDemo</Link>
                    <Link to="/forward-ref">ForwardRefDemo</Link>
                    <Link to="/context">ContextDemo</Link>
                    <Link to="/concurrent">ConcurrentModeDemo</Link>
                    <Link to="/suspense">SuspenseDemo</Link>
                    <Link to="/hooks">HooksDemo</Link>
                    <Link to="/children">ChildrenDemo</Link>
                    <Link to="/portal">PortalDemo</Link>
                    <br />
                    <Link to="/control_comp">双向绑定demo</Link>
                </nav>
                <div className="contents">{routes}</div>
            </div>
        )
    }
}

export default App
