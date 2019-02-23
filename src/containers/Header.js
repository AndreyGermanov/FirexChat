import HeaderComponent from '../components/Header';
import {connect} from 'react-redux';
import Store from '../store/Store';
import {Screens} from "../reducers/RootReducer";
import Backend from '../services/Backend';

/**
 * Controller for application Header Tab bar
 */
export default class HeaderContainer {

    /**
     * Binds properties and methods of this controller to related screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;

    static getComponent() {
        if (!HeaderContainer.component) {
            const item = new HeaderContainer();
            HeaderContainer.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(HeaderComponent);
        }
        return HeaderContainer.component;
    }

    /**
     * Defines which properties of global application state will be visible inside related view
     * @param state Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return {
            activeScreen: state.activeScreen
        }
    }

    /**
     * Defines which controllers methods will be available to execute from related screen
     * @returns: Array of methods
     */
    mapDispatchToProps() {
        return {
            gotoUsers: () => this.gotoUsers(),
            gotoProfile: () => this.gotoProfile()
        }
    }

    /**
     * "LIST" tab onClick handler. Used to move to Users List screen
     */
    gotoUsers() {
        Store.changeProperty("activeScreen",Screens.USERS_LIST)
    }

    /**
     * "PROFILE" tab onClick handler. Used to move to User Profile screen
     */
    gotoProfile() {
        const profile = Backend.auth.getProfile();
        Store.changeProperties({
            "activeScreen": Screens.PROFILE,
            "profile.selectedImage": "",
            "profile.email": profile.id,
            "profile.name": profile.name,
            "profile.image": profile.image
        })
    }
}