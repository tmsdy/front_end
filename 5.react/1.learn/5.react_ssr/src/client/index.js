import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import Counter from '../containers/Counter'
import Header from '../components/Header'
import routes from "../routes"
import { BrowserRouter } from 'react-router-dom';

ReactDOM.hydrate(
    <BrowserRouter>
        <Fragment>
            <Header />
            <div className="container" style={{ marginTop: 70 }}>
                {routes}
            </div>
        </Fragment>
    </BrowserRouter>
    , document.getElementById('root'))