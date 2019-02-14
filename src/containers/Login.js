import LoginComponent from '../components/Login';
import {connect} from 'react-redux';

export default class LoginContainer {

    /**
     * Binds properties and methods of this controller main screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;

    static getComponent() {
        if (!LoginContainer.component) {
            const item = new LoginContainer();
            LoginContainer.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(LoginComponent);
        }
        return LoginContainer.component;
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