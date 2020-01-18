import React, { Component } from 'react';
import { bindActionCreators } from '../redux';
import { StoreContext } from './Context'
import propTypes from 'prop-types';
export default function (mapStateToProps, mapDispatchToProps) {
    return function (WrapedComponent) {
        class ProxyComponent extends Component {
            // static contextTypes = {
            //     store: propTypes.object
            // }
            constructor(props) {
                super(props);
                // console.log(context.store)
                // this.store = context.store;
                // this.state = mapStateToProps(this.store.getState());
            }
            componentWillMount() {
                // this.unsubscribe = this.store.subscribe(() => {
                //     this.setState(mapStateToProps(this.store.getState()));
                // });
            }
            componentWillUnmount() {
                // this.unsubscribe();
            }
            render() {
                // let actions = {};
                // if (typeof mapDispatchToProps == 'function') {
                //     actions = mapDispatchToProps(this.store.dispatch);
                // } else if (typeof mapDispatchToProps == 'object') {
                //     actions = bindActionCreators(mapDispatchToProps, this.store.dispatch);
                // }
                console.log('props=', this.props)
                let { store } = this.props
                return <WrapedComponent {...mapStateToProps(store.getState())} {...bindActionCreators(mapDispatchToProps, store.dispatch)} />
            }
        }
        return <StoreContext.Consumer>{
            (store) => <ProxyComponent store={store}></ProxyComponent>
        }
        </StoreContext.Consumer>
    }
}