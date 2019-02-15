import RegisterComponent from '../components/Register';
import {connect} from 'react-redux';
import Store from "../store/Store";
import t from "../utils/translate";
import {Screens} from "../reducers/RootReducer";
import Backend from "../services/Backend";

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
            name: state.register.name,
            password: state.register.password,
            confirmPassword: state.register.confirmPassword,
            errors: state.register.errors
        }
    }

    mapDispatchToProps(dispatch) {
        return {
            submit: () => this.submit(),
            changeField: (name,value) => this.changeField(name,value),
            goLogin: () => this.goLogin()
        }
    }

    submit() {
        const errors = this.validate();
        if (errors) {
            Store.changeProperty("register.errors",errors);
            return;
        } else {
            Store.changeProperty("register.errors",{});
        }
        Store.changeProperty("activeScreen",Screens.LOADING);
        const state = Store.getState().register;
        Backend.auth.register(state.name,state.password, (error) => {

            if (error) {
                Store.changeProperty("register.errors", {"general":error});
                Store.changeProperty("activeScreen",Screens.REGISTER);
            } else {
                Backend.auth.checkLogin();
                Store.changeProperties({"register.name":"","register.password":"","register.errors":{}});
            }
        })
    }

    validate() {
        const state = Store.getState().register;
        const errors = {};
        if (!state.name.trim().length) errors["name"] = t("Name is required");
        if (!state.password.trim().length) errors["password"] = t("Password is required");
        if (state.password.trim() !== state.confirmPassword.trim()) errors["password"] = t("Passwords must match");
        if (Object.getOwnPropertyNames(errors).length) return errors;
        return null;
    }

    changeField(name,value) {
        Store.changeProperty("register."+name,value);
    }

    goLogin() {
        Store.changeProperties({
            "login.name": "",
            "login.password": "",
            "login.errors": {},
            "register.name": "",
            "register.password": "",
            "register.confirmPassword": "",
            "register.errors": {},
            "activeScreen": Screens.LOGIN
        })
    }
}