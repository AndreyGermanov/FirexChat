import RegisterComponent from '../components/Register';
import {connect} from 'react-redux';
import Store from "../store/Store";
import t from "../utils/translate";
import {Screens} from "../reducers/RootReducer";
import Backend from "../services/Backend";

/**
 * Controller for Sign Up screen
 */
export default class RegisterContainer {

    /**
     * Binds properties and methods of this controller to related screen view and returns component
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

    /**
     * Defines which properties of global application state will be visible inside related view
     * @param state Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return {
            name: state.register.name,
            password: state.register.password,
            confirmPassword: state.register.confirmPassword,
            errors: state.register.errors
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
            goLogin: () => this.goLogin()
        }
    }

    /**
     * "Register" button onClick handler. Validates provided data and tries to login with it.
     * Shows error messages if there are errors
     */
    submit() {
        const errors = this.validate();
        if (errors) {
            Store.changeProperty("register.errors",errors);
            return;
        } else Store.changeProperty("register.errors",{});
        Store.changeProperty("activeScreen",Screens.LOADING);
        const state = Store.getState().register;
        Backend.auth.register(state.name,state.password, (error) => {
            if (error) Store.changeProperties({"register.errors":{"general":error},"activeScreen":Screens.REGISTER});
            else {
                Backend.auth.checkLogin();
                Store.changeProperties({"register.name":"","register.password":"","register.errors":{}});
            }
        })
    }

    /**
     * Method validates form data
     * @returns Error messages object or null if no errors
     */
    validate() {
        const state = Store.getState().register;
        const errors = {};
        if (!state.name.trim().length) errors["name"] = t("Name is required");
        if (!state.password.trim().length) errors["password"] = t("Password is required");
        if (state.password.trim() !== state.confirmPassword.trim()) errors["password"] = t("Passwords must match");
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
        Store.changeProperty("register."+name,value);
    }

    /**
     * Method used as onClick handler for "Already registered ?" link. Moves to "Login" screen.
     */
    goLogin() {
        Store.changeProperties({
            "login.name": "", "login.password": "", "login.errors": {},
            "register.name": "", "register.password": "", "register.confirmPassword": "", "register.errors": {},
            "activeScreen": Screens.LOGIN
        })
    }
}