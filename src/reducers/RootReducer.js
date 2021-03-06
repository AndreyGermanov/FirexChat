import actions from '../actions/Actions';
import Store from '../store/Store';
import _ from 'lodash';
import React from 'react';

/**
 * Enum for application screens
 */
export const Screens = {
    LOADING: 'SCREENS_LOADING',
    LOGIN: 'SCREENS_LOGIN',
    REGISTER: 'SCREENS_REGISTER',
    PROFILE: 'SCREENS_PROFILE',
    USERS_LIST: 'SCREENS_USERS_LIST',
    VIDEO_CHAT: 'SCREENS_VIDEO_CHAT',
    IMAGE_PICKER: 'IMAGE_PICKER'
};

/**
 * Enum for VideoChat screen modes
 */
export const ChatMode = {
    CALLING: 'CHAT_MODE_CALLING',
    TALKING: 'CHAT_MODE_TALKING'
};

/**
 * Enum for ImagePicker screen modes
 */
export const ImagePickerMode = {
    CAMERA: 'IMAGE_PICKER_MODE_CAMERA',
    LIBRARY: "IMAGE_PICKER_MODE_LIBRARY"
};

// noinspection JSUnresolvedFunction
/**
 * Global application state
 */
export const initialState = {
    activeScreen: Screens.LOADING,
    localStream: null,
    isLogin: false,
    login: {
        name: "",
        password: "",
        errors: {}
    },
    register: {
        name: "",
        password: "",
        confirmPassword: "",
        errors: {}
    },
    profile: {
        name: "",
        image: "",
        password: "",
        confirmPassword: "",
        errors: {},
        selectedImage: ""
    },
    users: {
        updatesCounter:0
    },
    chat: {
        updatesCounter:0,
        mode: null
    },
    imagePicker: {
        mode: ImagePickerMode.CAMERA
    }
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
            for (let name in action.properties) {
                // noinspection JSUnfilteredForInLoop
                changeProperty(name,action.properties[name],newState);
            }
            break;
        default:
            break;
    }
    return newState;
}

/**
 * Method used to change specified property in Global appliction state
 * @param name - name of property
 * @param value - value of property
 * @param newState - application state object before change
 * @returns Application state object with applied change
 */
const changeProperty = function(name,value,newState) {
    let clonedValue = _.cloneDeep(value);
    if (!clonedValue || typeof(clonedValue) !== "object" || !Object.getOwnPropertyNames(clonedValue).length) {
        // noinspection JSUnusedAssignment
        clonedValue = value;
    }
    // noinspection JSUnresolvedFunction
    eval("newState"+Store.getPropertyNameExpression(name)+ " = clonedValue;");
    return newState
};
