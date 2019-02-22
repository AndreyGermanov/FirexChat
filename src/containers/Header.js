import HeaderComponent from '../components/Header';
import {connect} from 'react-redux';
import Store from '../store/Store';
import {Screens} from "../reducers/RootReducer";
import Backend from '../services/Backend';

export default class HeaderContainer {

    /**
     * Binds properties and methods of this controller main screen view and returns component
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

    mapStateToProps(state) {
        return {
            activeScreen: state.activeScreen
        }
    }

    mapDispatchToProps() {
        return {
            gotoUsers: () => this.gotoUsers(),
            gotoProfile: () => this.gotoProfile()
        }
    }

    gotoUsers() {
        Store.changeProperty("activeScreen",Screens.USERS_LIST)
    }

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