import firebase from 'react-native-firebase';
import async from 'async';
import Store from '../store/Store';
import {Screens} from "../reducers/RootReducer";
import Service from './Service';
import t from '../utils/translate'

/**
 * User authentication service. Used to manage user Sign In, Sign Up and Profile update
 */
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

    /**
     * Initialization methods
     */
    init() {
        firebase.auth().onAuthStateChanged((user) => {
            this.checkLogin(user)
        });
        this.checkLogin(this.user())
    }

    /**
     * Method used to check is user login and implement actions depending on
     * current status
     * @param user - User object to check. If not provided, then tries to get current user
     */
    checkLogin(user) {
        if (!user) user = firebase.auth().currentUser;
        if (user && user.email) {
            this.applyLogin();
        } else {
            if (user) firebase.auth().signOut().then(()=>{});
            this.applyLogout();
        }
    }

    /**
     * Returns current authenticated user object or null if not authenticated
     */
    user() {
        return firebase.auth().currentUser;
    }

    /**
     * Method runs right after user authentication status changed to "Authenticated"
     */
    applyLogin() {
        const profile = this.getProfile();
        // noinspection JSUnresolvedFunction
        Store.changeProperties({
            isLogin: true,
            activeScreen: Screens.USERS_LIST,
            "profile.name": profile.name,
            "profile.email": profile.id,
            "profile.image": profile.image
        });
        this.triggerEvent("onAuthChange",[true]);
    }

    /**
     * Method runs right after user authentication status changed to "Not authenticated"
     */
    applyLogout() {
        Store.changeProperties({
            isLogin: false,
            activeScreen: Screens.LOGIN
        });
        this.triggerEvent("onAuthChange",[false]);
    }

    /**
     * Method used to Sign in user
     * @param email - User Email
     * @param password - User Password
     * @param callback - Function runs when operation finished
     */
    login(email,password,callback=()=>{}) {
        firebase.auth().signInWithEmailAndPassword(email,password)
            .then(() => {
                callback()
            })
            .catch(error => {
                callback(error.message)
            })
    }

    /**
     * Method used to Sign Out current user
     * @param callback - Function runs when operation finished
     */
    logout(callback=()=>{}) {
        firebase.auth().signOut().then(() => {
            callback()
        })
    }

    /**
     * Method used to Register user with specified email and password and Sign In with user automatically after register
     * @param email - User email
     * @param password - User password
     * @param callback - Function runs when operation finished
     */
    register(email,password,callback=()=>{}) {
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(() => {
            callback();
        })
        .catch((error) => {
            callback(error.message);
        })
    }

    /**
     * Method used to update user profile
     * @param fields - Object with profile parts to update: Email, Password, or Profile: {name,photoURL}
     * @param callback - Function runs when operation finished
     */
    update(fields,callback=()=>{}) {
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

    /**
     * Method used to update user email
     * @param email - New email
     * @param callback - Function runs when operation finished
     */
    updateEmail(email,callback=()=>{}) {
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

    /**
     * Method used to update user password
     * @param password - New password
     * @param callback - Function runs when operation finished
     */
    updatePassword(password,callback=()=>{}) {
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

    /**
     * Method used to update User profile data
     * @param profile - Object with profile fields to update. Can contain fields: "name" - user name, "photoURL" -
     * full public URL to user profile image.
     * @param callback - Function runs when operation finished
     */
    updateProfile(profile,callback=()=>{}) {
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

    /**
     * Method used to return user profile data
     * @returns  Object with data of this user
     */
    getProfile() {
        const user = this.user();
        if (!user || !user.email) return {};
        return {
            id: user.email,
            name: user.displayName ? user.displayName : user.email,
            image: user.photoURL ? user.photoURL : "",
            updatedAt: Date.now()
        }
    }
}

export default Auth.getInstance();