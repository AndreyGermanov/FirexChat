import UsersListComponent from '../components/UsersList';
import {connect} from 'react-redux';

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

        }
    }

    mapDispatchToProps(dispatch) {
        return {

        }
    }
}