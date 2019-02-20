import firebase from 'react-native-firebase';
import async from 'async';
import Store from '../store/Store';
import {Screens} from "../reducers/RootReducer";
import Service from './Service';
import t from '../utils/translate'

class Auth extends Service {

    /**
     * Returns single instance of this service
     * @returns Instance of service
     */
    static instance = null;

    static getInstance() {
        if (!Auth.instance) Auth.instance = new Auth();
        return Auth.instance;
    }

    init() {
        firebase.auth().onAuthStateChanged((user) => {
            this.checkLogin(user)
        });
        this.updateActivityTimer = null;
        this.checkLogin(this.user())

    }

    checkLogin(user) {
        if (!user) user = firebase.auth().currentUser;
        if (user && user.email) {
            this.applyLogin();
        } else {
            if (user) firebase.auth().signOut().then(()=>{});
            this.applyLogout();
        }
    }

    user() {
        return firebase.auth().currentUser;
    }

    applyLogin() {
        Store.changeProperties({
            isLogin: true,
            activeScreen: Screens.USERS_LIST
        });
        this.triggerEvent("onAuthChange",[true]);
    }

    applyLogout() {
        clearInterval(this.updateActivityTimer);
        this.updateActivityTimer = null;
        Store.changeProperties({
            isLogin: false,
            activeScreen: Screens.LOGIN
        });
        this.triggerEvent("onAuthChange",[false]);
    }

    login(email,password,callback) {
        firebase.auth().signInWithEmailAndPassword(email,password)
            .then(() => {
                callback()
            })
            .catch(error => {
                callback(error.message)
            })
    }

    logout(callback) {
        firebase.auth().signOut().then(() => {
            callback()
        })
    }

    register(email,password,callback) {
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(() => {
            callback();
        })
        .catch((error) => {
            callback(error.message);
        })
    }

    update(fields,callback) {
        if (!this.user()) {
            callback(t("Not logged in"));
            return;
        }
        async.series([
            (callback) => {
                this.updateEmail(fields.email,callback)
            },
            (callback) => {
                this.updatePassword(fields.password,callback)
            },
            (callback) => {
                this.updateProfile(fields.profile,callback)
            }
        ],
        (error) => {
            callback(error);
        });
    }

    updateEmail(email,callback) {
        if (!email || email === this.user().email) {
            callback();
            return;
        }
        this.user().updateEmail(email)
        .then(() => {
            callback();
        })
        .catch((error) => {
            callback(error.message);
        })
    }

    updatePassword(password,callback) {
        if (!password) {
            callback();
            return;
        }
        this.user().updatePassword(password)
        .then(() => {
            callback();
        })
        .catch((error) => {
            callback(error.message);
        })
    }

    updateProfile(profile,callback) {
        if (!profile || !Object.getOwnPropertyNames(profile).length) {
            callback();
            return;
        }
        this.user().updateProfile(profile)
        .then(() => {
            callback();
        })
        .catch((error) => {
            callback(error.message)
        })
    }
}

export default Auth.getInstance();