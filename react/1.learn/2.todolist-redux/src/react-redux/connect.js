import React, { Component } from 'react';
import propTypes from 'prop-types';
export default function (mapStateToProps, mapDispatchToProps) {
    return function (OriginComp) {
        class ConnectComp extends Component {
            static contextTypes = {
                store: propTypes.object
            }
            componentWillMount() {
                let store = this.context.store
                this.unsubscribe = store.subscribe(() => {
                    this.setState(mapStateToProps(store.getState()));
                });
            }
            componentWillUnmount() {
                this.unsubscribe();
            }
            render() {
                let store = this.context.store
                return <OriginComp
                    {...mapStateToProps(store.getState())}
                    {...mapDispatchToProps(store.dispatch)}
                />
            }
        }
        return ConnectComp;
    }
}