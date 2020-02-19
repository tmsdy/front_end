import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import ReactPage from './React'
import VuePage from './Vue'
import FlutterPage from './Flutter'

export default (props) => {
    return (
        <Router>
            <div className="topNav">
                <ul>
                    <li><Link to="/video/react/">react</Link></li>
                    <li><Link to="/video/vue/">vue</Link></li>
                    <li><Link to="/video/flutter/">flutter</Link></li>
                </ul>
            </div>
            <div className="video">
                <div><h3>视频教程</h3></div>
                <Route path="/video/react/" component={ReactPage}></Route>
                <Route path="/video/vue/" component={VuePage}></Route>
                <Route path="/video/flutter/" component={FlutterPage}></Route>
            </div>
        </Router>
    )
}