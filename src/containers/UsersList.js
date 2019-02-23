import UsersListComponent from '../components/UsersList';
import {connect} from 'react-redux';
import Sessions from '../models/Sessions';
import Store from '../store/Store';
import Backend from '../services/Backend'

/**
 * Controller for Users List screen
 */
export default class UsersListContainer {

    /**
     * Binds properties and methods of this controller to related screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;

    static getComponent() {
        if (!UsersListContainer.component) {
            const item = new UsersListContainer();
            UsersListContainer.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(UsersListComponent);
        }
        return UsersListContainer.component;
    }

    /**
     * Defines which properties of global application state will be visible inside related view
     * @param state Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        state = Store.getState();
        return {
            updatesCounter: state.users.updatesCounter,
            users: Sessions.list && Sessions.list.length ? users= Sessions.list
                .filter((item) => item.id !== Backend.auth.user().email)
                .map((item) => { item.key = item.id; return item;}) : [],
            incomingCalls: Backend.videoChat.incomingCalls,
            isOnline: Backend.videoChat.isOnline()
        }
    }

    /**
     * Defines which controllers methods will be available to execute from related screen
     * @returns: Array of methods
     */
    mapDispatchToProps() {
        return {
            loadList: () => this.loadList(),
            call: (userId) => this.call(userId),
            answer: (userId) => this.answer(userId),
            reject: (userId) => this.reject(userId)
        }
    }

    /**
     * Method used to load users list to Session collection from Backend and then
     * refresh screen to show new data
     */
    loadList() {
        Sessions.loadList(() => {
            const state = Store.getState();
            Store.changeProperty("users.updatesCounter",state.users.updatesCounter+1);
        })
    }

    /**
     * Method runs when user presses Call button on the right of specified contact
     * @param userId - Id of user to call to
     */
    call(userId) {
        Backend.videoChat.call(userId);
    }

    /**
     * Method runs when user presses Answer button when other user is calling
     * @param userId - Id of user to answer to
     */
    answer(userId) {
        Backend.videoChat.acceptCall(userId);
    }

    /**
     * Method runs when user presses "Reject" button to reject incoming call from other user
     * @param userId
     */
    reject(userId) {
        Backend.videoChat.rejectCall(userId);
    }
}