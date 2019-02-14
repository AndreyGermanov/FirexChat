import actions from '../actions/Actions';
import Store from '../store/Store';
import _ from 'lodash';
import React from 'react';


export const Screens = {
    LOADING: 'SCREENS_LOADING',
    LOGIN: 'SCREENS_LOGIN',
    REGISTER: 'SCREENS_REGISTER',
    PROFILE: 'SCREENS_PROFILE',
    USERS_LIST: 'SCREENS_USERS_LIST',
    VIDEO_CHAT: 'SCREENS_VIDEO_CHAT'
};

/**
 * Global application state
 */
export const initialState = {
    activeScreen: Screens.VIDEO_CHAT,
    localStream: null
};

/**
 * Root reducer function
 * @param state: Current state before change
 * @param action: Action, which should be applied to state
 * @returns new state after apply action
 */
export default function rootReducer(state=initialState,action) {
    let newState = _.cloneDeep(state);
    switch (action.type) {
        case actions.types.CHANGE_PROPERTY:
            newState = changeProperty(action.name,action.value,newState);
            break;
        case actions.types.CHANGE_PROPERTIES:
            for (let name in action.properties) changeProperty(name,action.properties[name],newState);
            break;
        default:
            break;
    }
    return newState;
}

const changeProperty = function(name,value,newState) {
    var clonedValue = _.cloneDeep(value);
    if (!clonedValue || !Object.getOwnPropertyNames(clonedValue).length) clonedValue = value;
    eval("newState"+Store.getPropertyNameExpression(name)+ " = clonedValue;");
    return newState
};
