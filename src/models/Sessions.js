import Backend from '../services/Backend';
import Store from '../store/Store';
import Signalling from "../services/Signalling";

/**
 * Data collection used to manage active users, which displayed on Users List screen
 */
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

    /**
     * Class constructor
     */
    constructor() {
        this.list = [];
    }

    /**
     * Initialization method
     */
    init() {
        Backend.auth.subscribe(this);
    }

    /**
     * Method used to send User list request to backend WebSocket server
     * @param callback - Function runs when request sent
     */
    loadList(callback=()=>{}) {
        console.log("LOADING USERS LIST");
        Signalling.requestUsersList();
    }

    /**
     * Handler which runs when current user authentication status changes (user logs in or logs out).
     * Used to refresh sessions list or unload sessions list
     * @param isLogin
     */
    onAuthChange(isLogin) {
        if (isLogin) {
            Signalling.subscribe(this);
            this.loadList();
        } else {
            this.list = [];
            Signalling.unsubscribe(this);
        }
    }

    /**
     * Method runs when response from backend server received
     * @param event - Response from server object
     */
    onSignal(event) {
        console.log(event);
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

    /**
     * Method used to update user information from provided data
     * @param data - Object with user data
     */
    updateUser(data) {
        console.log("UPDATING USER");
        let index = this.list.findIndex((item) => item.id === data.id);
        if (index === -1) index = this.list.length;
        this.list[index] = { id: data.id, name: data.name, image: data.image };
        console.log(this.list);
    }
}

export default Sessions.getInstance();