import AppComponent from '../components/App';
import {connect} from 'react-redux';
import Backend from '../services/Backend';
import Sessions from '../models/Sessions';

/**
 * Controller for main application component
 */
export default class AppContainer {

    /**
     * Binds properties and methods of this controller to related screen view and returns component
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
            start: () => this.start()
        }
    }

    /**
     * Entry point method of application. Used to initialize backend and start Authentication sequence
     */
    start() {
        Backend.init();
        Sessions.init();
    }
}