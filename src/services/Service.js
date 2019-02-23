/**
 * Base class for all services, which can propagate events to subsribers
 */
export default class Service {

    /**
     * Class constructor
     */
    constructor() {
        this.subsribers = [];
    }

    /**
     * Method used to subscribe specified object to events from this service
     * @param subscriber - Subscriber object
     */
    subscribe(subscriber) {
        if (this.subsribers.indexOf(subscriber) === -1) {
            this.subsribers.push(subscriber);
        }
    }

    /**
     * Method used to unsubscribe specified object from events from this service
     * @param subscriber - Subscriber object
     */
    unsubscribe(subscriber) {
        if (this.subsribers.indexOf(subscriber) !== -1) {
            this.subsribers.splice(this.subsribers.indexOf(subscriber),1);
        }
    }

    /**
     * Used to call specified method on all subscribers. Subscribers must have this method
     * @param handlerMethodName - Name of method on subscribers to call
     * @param args - array of arguments to pass to that method
     */
    triggerEvent(handlerMethodName,args) {
        this.subsribers.forEach((subscriber) => {
            if (subscriber && typeof(subscriber) === "object" && typeof(subscriber[handlerMethodName])==='function') {
                subscriber[handlerMethodName].apply(subscriber,args);
            }
        })
    }

}