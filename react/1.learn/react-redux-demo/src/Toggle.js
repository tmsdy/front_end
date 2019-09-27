import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { TOGGLE } from "./reducer/UiReducer";

const Toggle = ({ toggleSwitch }) => {
    const ui = useSelector(state => state.ui);
    const dispatch = useDispatch();
    console.log(ui)
    return (
        <div>
            <div>{JSON.stringify(ui)}</div>
            <input
                type="checkbox"
                value={ui.toggle}
                onChange={() => dispatch({ type: TOGGLE })}
            />
        </div>
    );
};

export default Toggle;
