import AppComponent from '../components/App';
import {connect} from 'react-redux';
import Backend from '../services/Backend';
import Sessions from '../models/Sessions';

export default class AppContainer {

    /**
     * Binds properties and methods of this controller main screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;

    static getComponent() {
        if (!AppContainer.component) {
            const item = new AppContainer();
            AppContainer.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(AppComponent);
        }
        return AppContainer.component;
    }

    mapStateToProps(state) {
        return {
            activeScreen: state.activeScreen
        }
    }

    mapDispatchToProps() {
        return {
            start: () => this.start()
        }
    }

    start() {
        Backend.init();
        Sessions.init();
    }
}