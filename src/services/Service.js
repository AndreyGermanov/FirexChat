export default class Service {

    constructor() {
        this.subsribers = [];
    }

    subscribe(subscriber) {
        if (this.subsribers.indexOf(subscriber) === -1) {
            this.subsribers.push(subscriber);
        }
    }

    unsubscribe(subscriber) {
        if (this.subsribers.indexOf(subscriber) !== -1) {
            this.subsribers.splice(this.subsribers.indexOf(subscriber),1);
        }
    }

    triggerEvent(handlerMethodName,args) {
        this.subsribers.forEach((subscriber) => {
            if (subscriber && typeof(subscriber) === "object") {
                subscriber[handlerMethodName].apply(subscriber,args);
            }
        })
    }

}