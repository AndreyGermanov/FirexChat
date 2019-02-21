import Backend from '../services/Backend';
import Store from '../store/Store';
import Signalling from "../services/Signalling";

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
        Backend.auth.subscribe(this);
    }

    loadList(callback=()=>{}) {
        Signalling.requestUsersList();
    }

    onAuthChange(isLogin) {
        if (isLogin) {
            Signalling.subscribe(this);
            this.loadList();
        } else {
            this.list = [];
            Signalling.unsubscribe(this);
        }
    }

    onSignal(event) {
        let state = Store.getState();
        switch (event.type) {
            case "update_user_profile":
                this.updateUser(event.data);
                Store.changeProperty("users.updatesCounter",state.users.updatesCounter+1);
                break;
            case "users_list":
                const list = event.data.list;
                if (list && list.length) list.forEach((data) => this.updateUser(data));
                Store.changeProperty("users.updatesCounter",state.users.updatesCounter+1);
        }
    }

    updateUser(data) {
        let index = this.list.findIndex((item) => item.id === data.id);
        if (index === -1) index = this.list.length;
        this.list[index] = { id: data.id, name: data.name, image: data.image };
    }
}

export default Sessions.getInstance();