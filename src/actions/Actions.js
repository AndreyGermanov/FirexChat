/**
 * Global application actions which changes Redux state
 */
class Actions {

    /**
     * Class constructor
     */
    constructor() {
        // List of possible action types
        this.types = {
            CHANGE_PROPERTY: "ACTIONS_CHANGE_PROPERTY",
            CHANGE_PROPERTIES: "ACTIONS_CHANGE_PROPERTIES"
        }
    }

    /**
     * Action used to change single property in application state
     * @param name: Name of property
     * @param value: Value of property
     * @returns Action object to dispatch to reducer
     */
    changeProperty(name,value) {
        return {
            type: this.types.CHANGE_PROPERTY,
            name: name,
            value: value
        }
    }

    /**
     * Action used to change set of properties in application state
     * @param properties: Hashmap of properties
     * @returns Action object to dispatch to reducer
     */
    changeProperties(properties) {
        return {
            type: this.types.CHANGE_PROPERTIES,
            properties: properties
        }
    }
}

export default new Actions()