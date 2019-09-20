import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import App from './App'
import login from './pages/login'
import Buttons from './pages/ui/buttons'
import Bar from './pages/echarts/bar'
import Line from './pages/echarts/line'
import Pie from './pages/echarts/pie'
import Learn from './pages/echarts/learn'
import Admin from './admin'
import NoMatch from './pages/nomatch'

export default (props) => {
    return (
        <HashRouter>
            <App>
                <Switch>
                    <Route path="/login" component={login} />
                    <Route path="/" render={() =>
                        <Admin>
                            <Switch>
                                <Route path="/ui/buttons" component={Buttons}></Route>
                                <Route path="/charts/bar" component={Bar}></Route>
                                <Route path="/charts/line" component={Line}></Route>
                                <Route path="/charts/pie" component={Pie}></Route>
                                <Route path="/charts/learn" component={Learn}></Route>
                                <Route component={NoMatch}></Route>
                            </Switch>
                        </Admin>
                    } />
                </Switch>
            </App>
        </HashRouter>
    )
}