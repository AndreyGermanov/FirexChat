import Backend from '../services/Backend';
import Store from '../store/Store';

class Sessions {

    /**
     * Returns single instance of this collection
     * @returns Instance of service
     */
    static instance = null;

    static getInstance() {
        if (!Sessions.instance) Sessions.instance = new Sessions();
        return Sessions.instance;
    }

    init() {
        this.list = [];
        Backend.db.subscribe(this,'sessions');
        Backend.auth.subscribe(this);
    }

    loadList(callback) {
        Backend.db.getList('sessions',null, (err,rows) => {
            if (!err) {
                this.list = rows;
            }
            callback();
        })
    }

    onDatabaseChange(collection,change) {
        let state = Store.getState();
        if (collection === 'sessions' && change.type !== 'modified') {
            switch (change.type) {
                case "added" : {
                    this.list.push(change.data);
                    break;
                }
                case "removed": {
                    let id = this.list.findIndex(change.data.id);
                    if (id !== -1) {
                        this.list.splice(id,1);
                    }
                }
            }
            Store.changeProperty("users.updatesCounter",state.users.updatesCounter+1);
        }
    }

    onAuthChange(isLogin) {
        this.list = [];
        if (isLogin) {
            Backend.db.subscribe(this,'sessions');
        } else {
            Backend.db.unsubscribe(this,'sessions');
        }
    }
}

export default Sessions.getInstance();