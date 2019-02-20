import firebase from "react-native-firebase"

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

    constructor() {
        this.subsribers = {};
        this.collectionListeners = {};
    }

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

    getQuery(collection,condition) {
        let query = firebase.firestore().collection(collection);
        if (condition) {
            query = query.where(condition)
        }
        return query;
    }

    putItem(collection, id, data, callback) {
        let request = null;
        if (id) {
            request = firebase.firestore().collection(collection).doc(id).set(data)
        } else {
            request = firebase.firestore().collection(collection).add(data)
        }
        request.then((doc) => callback(null,doc)).catch((error) => callback(error.message));
    }

    deleteItem(collection,id,callback) {
        firebase.firestore().collection(collection).doc(id).delete()
        .then(() => {
            callback()
        }).catch((error) => {
            callback(error.message);
        });
    }

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