import {createStore} from 'redux'
import rootReducer from '../reducers/RootReducer'
import _ from 'lodash';
import async from 'async';
import actions from '../actions/Actions'

/**
 * Wrapper class for Redux store, which used to manage application state
 */
const Store = class {

    static instance;

    /**
     * Method used to implement "Singleton" pattern for this object. It returns single instance of Application state store
     * @returns Store instance
     */
    static getInstance() {
        if (Store.instance == null)
            Store.instance = new Store();
        return Store.instance;
    }
    /**
     * Class constructor
     */
    constructor() {
        // Link to actual Redux store, which manages application state using RootReducer
        this.store = createStore(rootReducer);
        this.events = {};
    }

    /**
     * Method returns copy of current application state
     */
    getState() {
        return _.cloneDeep(this.store.getState());
    }

    /**
     * Method used to trigger custom events, which will be propagated to all listeners
     * @param event Name of event
     * @param callback Function, which will be called after event handled by all subscribed listeners
     */
    triggerEvent(event,callback) {
        if (!this.events[event] || !this.events[event].length) return;
        async.eachSeries(this.events[event],(object,callback) => {
            if (!object || !object["handleEvent"] || typeof(object["handleEvent"]) !== "function") {
                callback();
                return;
            };
            object.handleEvent(event, () => {
                callback();
            })
        }, function() {
            if (callback) callback();
        })
    }

    /**
     * Method which used to subscribe object to specified custom event
     * @param event - Name of event to subscribe to
     * @param object - Object to subscribe
     */
    subscribe(event,object) {
        if (!this.events[event]) this.events[event] = [];
        if (this.events[event].indexOf(object) === -1) this.events[event].push(object);
    }

    /**
     * Method which used to unsubscribe object from specified custom event
     * @param event - Name of event to unsubscribe from
     * @param object - Object to unsubscribe
     */
    unsubscribe(event,object) {
        let index = this.events[event].indexOf(object);
        if (index !== -1) this.events[event].splice(index,1);
    }

    changeProperty(name,value) {
        this.store.dispatch(actions.changeProperty(name,value))
    }

    changeProperties(keyValues) {
        this.store.dispatch(actions.changeProperties(keyValues))
    }

    getPropertyNameExpression(name) {
        return name.split(".").map( namePart => "['"+namePart+"']").reduce((s,s1) => s+s1)
    }

    getValue(name) {
        const state = this.getState();
        return eval("state"+this.getPropertyNameExpression(name))
    }
};

export default Store.getInstance()