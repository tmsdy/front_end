import React, { Component } from 'react';
import Header from './common/header'
import { Provider } from 'react-redux'
import store from './store'

class App extends Component {
    render() {
        return (
            //核心组件Provider,用来提供store给内部组件
            <Provider store={store}>
                <Header />
            </Provider>
        );
    }
}

export default App;
