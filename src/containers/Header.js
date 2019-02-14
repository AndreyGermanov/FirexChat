import HeaderComponent from '../components/Header';
import {connect} from 'react-redux';

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

        }
    }

    mapDispatchToProps(dispatch) {
        return {

        }
    }
}