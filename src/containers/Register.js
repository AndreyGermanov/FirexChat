import RegisterComponent from '../components/Register';
import {connect} from 'react-redux';

export default class RegisterContainer {

    /**
     * Binds properties and methods of this controller main screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;

    static getComponent() {
        if (!RegisterContainer.component) {
            const item = new RegisterContainer();
            RegisterContainer.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(RegisterComponent);
        }
        return RegisterContainer.component;
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