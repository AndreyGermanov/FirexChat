import UsersListComponent from '../components/UsersList';
import {connect} from 'react-redux';
import Sessions from '../models/Sessions';
import Store from '../store/Store';
import Backend from '../services/Backend'

export default class UsersListContainer {

    /**
     * Binds properties and methods of this controller main screen view and returns component
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

    mapStateToProps(state) {
        state = Store.getState();
        return {
            updatesCounter: state.users.updatesCounter,
            users: [
                {id:'test@test.com',key:'test@test.com',name:'Andrey Germanov'},
                {id:'test2@test.com',key:'test2@test.com',name:'John Doe'}
            ],
            incomingCalls: Backend.videoChat.incomingCalls
        }
    }

    mapDispatchToProps() {
        return {
            loadList: () => this.loadList(),
            call: (userId) => this.call(userId),
            answer: (userId) => this.answer(userId),
            reject: (userId) => this.reject(userId)
        }
    }

    loadList() {
        Sessions.loadList(() => {
            const state = Store.getState();
            Store.changeProperty("users.updatesCounter",state.users.updatesCounter+1);
        })
    }

    call(userId) {
        Backend.videoChat.call(userId);
    }

    answer(userId) {
        Backend.videoChat.acceptCall(userId);
    }

    reject(userId) {
        Backend.videoChat.rejectCall(userId);
    }
}