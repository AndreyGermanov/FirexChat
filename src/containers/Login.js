import LoginComponent from '../components/Login';
import {connect} from 'react-redux';
import Store from '../store/Store';
import t from '../utils/translate';
import Backend from '../services/Backend';
import {Screens} from "../reducers/RootReducer";

/**
 * Controller for Login component screen
 */
export default class LoginContainer {

    /**
     * Binds properties and methods of this controller to related screen view and returns component
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

    /**
     * Defines which properties of global application state will be visible inside related view
     * @param state Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return {
            name: state.login.name,
            password: state.login.password,
            errors: state.login.errors
        }
    }

    /**
     * Defines which controllers methods will be available to execute from related screen
     * @returns: Array of methods
     */
    mapDispatchToProps() {
        return {
            submit: () => this.submit(),
            changeField: (name,value) => this.changeField(name,value),
            goRegister: () => this.goRegister()
        }
    }

    /**
     * "Login" button onClick handler. Validates provided data and tries to login with it.
     * Shows error messages if there are errors
     */
    submit() {
        const errors = this.validate();
        if (errors) {
            Store.changeProperty("login.errors",errors);
            return;
        } else Store.changeProperties({"login.errors":{},"activeScreen":Screens.LOADING});
        const state = Store.getState().login;
        Backend.auth.login(state.name,state.password, (error) => {
            Backend.auth.checkLogin();
            if (error) Store.changeProperty("login.errors", {"general":error});
            else Store.changeProperties({"login.name":"","login.password":"","login.errors":{}});
        })
    }

    /**
     * Method validates form data
     * @returns Error messages object or null if no errors
     */
    validate() {
        const state = Store.getState().login;
        const errors = {};
        if (!state.name.trim().length) errors["name"] = t("Name is required");
        if (!state.password.trim().length) errors["password"] = t("Password is required");
        if (Object.getOwnPropertyNames(errors).length) return errors;
        return null;
    }

    /**
     * onChange handler for text input fields in the form. Used to forward entered text in fields to application
     * state
     * @param name - Name of input field
     * @param value - current value in field
     */
    changeField(name,value) {
        Store.changeProperty("login."+name,value);
    }

    /**
     * Method used as onClick handler for "Do not have an account ?" link. Moves to "Register" screen.
     */
    goRegister() {
        Store.changeProperties({
            "login.name": "", "login.password": "", "login.errors": {},
            "register.name": "", "register.password": "", "register.confirm_password": "", "register.errors": {},
            "activeScreen": Screens.REGISTER
        })
    }

}