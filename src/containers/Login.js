import LoginComponent from '../components/Login';
import {connect} from 'react-redux';
import Store from '../store/Store';
import t from '../utils/translate';
import Backend from '../services/Backend';
import {Screens} from "../reducers/RootReducer";

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
            name: state.login.name,
            password: state.login.password,
            errors: state.login.errors
        }
    }

    mapDispatchToProps(dispatch) {
        return {
            submit: () => this.submit(),
            changeField: (name,value) => this.changeField(name,value),
            goRegister: () => this.goRegister()
        }
    }

    submit() {
        const errors = this.validate();
        if (errors) {
            Store.changeProperty("login.errors",errors);
            return;
        } else {
            Store.changeProperty("login.errors",{});
        }
        Store.changeProperty("activeScreen",Screens.LOADING);
        const state = Store.getState().login;
        Backend.auth.login(state.name,state.password, (error) => {
            Backend.auth.checkLogin();
            if (error) {
                Store.changeProperty("login.errors", {"general":error});
            } else {
                Store.changeProperties({"login.name":"","login.password":"","login.errors":{}});
            }
        })
    }

    validate() {
        const state = Store.getState().login;
        const errors = {};
        if (!state.name.trim().length) errors["name"] = t("Name is required");
        if (!state.password.trim().length) errors["password"] = t("Password is required");
        if (Object.getOwnPropertyNames(errors).length) return errors;
        return null;
    }

    changeField(name,value) {
        Store.changeProperty("login."+name,value);
    }

    goRegister() {
        Store.changeProperties({
            "login.name": "",
            "login.password": "",
            "login.errors": {},
            "register.name": "",
            "register.password": "",
            "register.confirm_password": "",
            "register.errors": {},
            "activeScreen": Screens.REGISTER
        })
    }

}