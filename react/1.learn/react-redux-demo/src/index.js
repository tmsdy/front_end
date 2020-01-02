import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Store from "./store";
import Toggle from "./Toggle";

import "./index.css";

export function App() {
    return (
        <Provider store={Store}>
            <Toggle />
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById("root"));
