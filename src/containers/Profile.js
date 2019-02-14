import ProfileComponent from '../components/Profile';
import {connect} from 'react-redux';

export default class ProfileContainer {

    /**
     * Binds properties and methods of this controller main screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;

    static getComponent() {
        if (!ProfileContainer.component) {
            const item = new ProfileContainer();
            ProfileContainer.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(ProfileComponent);
        }
        return ProfileContainer.component;
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