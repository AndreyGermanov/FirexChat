import firebase from "react-native-firebase"

/**
 * Service used to work with Firebsae Firestore database
 */
class Database {

    /**
     * Returns single instance of this service
     * @returns Instance of service
     */
    static instance = null;

    static getInstance() {
        if (!Database.instance) Database.instance = new Database();
        return Database.instance;
    }

    /**
     * Class constructor
     */
    constructor() {
        this.subsribers = {};
        this.collectionListeners = {};
    }

    /**
     * Method used to get and return list of items in specified collection
     * @param collection - Name of collection
     * @param condition - Condition in format [field,operator,value]
     * @param callback - Function runs when operation finished
     */
    getList(collection,condition=null,callback) {
        let query = this.getQuery(collection,condition);
        query.get()
        .then((snapshot) => {
            let rows = [];
            snapshot.forEach((doc) => {
                let row = doc.data();
                row["id"] = doc["id"];
                rows.push(row);
            });
            callback(null,rows);
        })
        .catch((err) => {
            callback(err.message);
        })
    }

    /**
     * Method used to set changes listener for specified collection
     * @param collection - Collection name to listen changes for
     * @param condition - Condition, which filters changes: Listens changes only for items which meet specified condition
     */
    addCollectionListener(collection,condition=null) {
        let query = this.getQuery(collection,condition);
        query.onSnapshot((snapshot) => {
            snapshot.docChanges.forEach((change) => {
                let doc = change.doc.data();
                doc["id"] = change.doc.id;
                if (this.subsribers[collection] && this.subsribers[collection].length) {
                    this.subsribers[collection].forEach((subscriber) => {
                        subscriber.onDatabaseChange(collection,{type: change.type, data: doc})
                    })
                }
            })
        })
    }

    /**
     * Method builds Firebase query for specified parameters
     * @param collection - Collection name
     * @param condition - Condition
     * @returns FireStore query object
     */
    getQuery(collection,condition) {
        let query = firebase.firestore().collection(collection);
        if (condition) {
            query = query.where(condition)
        }
        return query;
    }

    /**
     * Method adds/updates item in collection
     * @param collection - Collection name
     * @param id - ID of item to update or null if need to add new item to collection
     * @param data - Item data object
     * @param callback - Function runs when operation finished
     */
    putItem(collection, id, data, callback) {
        let request = null;
        if (id) {
            request = firebase.firestore().collection(collection).doc(id).set(data)
        } else {
            request = firebase.firestore().collection(collection).add(data)
        }
        request.then((doc) => callback(null,doc)).catch((error) => callback(error.message));
    }

    /**
     * Method used to delete item with specified id from collection
     * @param collection - Collection name
     * @param id - ID of item to remove
     * @param callback - Function runs when operation finished
     */
    deleteItem(collection,id,callback) {
        firebase.firestore().collection(collection).doc(id).delete()
        .then(() => {
            callback()
        }).catch((error) => {
            callback(error.message);
        });
    }

    /**
     * Method used to subscribe specified object to events of this service
     * @param subscriber - Subscribe object
     * @param collection - Name of collection
     * @param condition - Condition
     */
    subscribe(subscriber,collection,condition=null) {
        if (!this.subsribers[collection]) {
            this.subsribers[collection] = [];
        }
        if (this.subsribers[collection].indexOf(subscriber) === -1) {
            this.subsribers[collection].push(subscriber);
        }
        if (!this.collectionListeners[collection]) {
            this.addCollectionListener(collection,condition);
        }
    }

    /**
     * Method used to unsubscribe specified object to events of this service
     * @param subscriber - Subscribe object
     * @param collection - Name of collection
     */
    unsubscribe(subscriber,collection) {
        if (!this.subsribers[collection]) {
            this.subsribers[collection] = [];
        }
        if (this.subsribers[collection].indexOf(subscriber) !== -1) {
            this.subsribers[collection].splice(this.subsribers[collection].indexOf(subscriber),1);
        }
    }
}

export default Database.getInstance();