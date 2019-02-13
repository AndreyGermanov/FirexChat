import React, {Component} from 'react';
import {Provider} from "react-redux";
import Store from "./src/store/Store";
import AppContainer from "./src/containers/App";

export default class RootView extends Component {

    render() {
        let App = AppContainer.getComponent();
        return (
            <Provider store={Store.store}>
                <App/>
            </Provider>
        )
    }
}