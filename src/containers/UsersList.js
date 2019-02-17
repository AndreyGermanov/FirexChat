import UsersListComponent from '../components/UsersList';
import {connect} from 'react-redux';
import Sessions from '../models/Sessions';
import Store from '../store/Store';
import VideoChat from '../services/VideoChat'

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
        return {
            updatesCounter: state.users.updatesCounter,
            users: Sessions.list && Sessions.list.length ? Sessions.list : [
                {id:'test@test.com'},
                {id:'test2@test.com'}
            ],
            incomingCalls: VideoChat.incomingCalls
        }
    }

    mapDispatchToProps(dispatch) {
        return {
            loadList: () => this.loadList(),
            call: (userId) => this.call(userId),
            answer: (userId,answerType) => this.answer(userId,answerType)
        }
    }

    loadList() {
        Sessions.loadList(() => {
            const state = Store.getState();
            Store.changeProperty("users.updatesCounter",state.users.updatesCounter+1);
        })
    }

    call(userId) {
        VideoChat.call(userId,()=> {
            console.log("CALLED TO "+userId);
        });
    }

    answer(userId,answerType) {
        VideoChat.answer(userId,answerType);
    }
}