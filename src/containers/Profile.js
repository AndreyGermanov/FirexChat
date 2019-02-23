import ProfileComponent from '../components/Profile';
import {connect} from 'react-redux';
import Backend from '../services/Backend';
import Signalling from '../services/Signalling';
import Store from "../store/Store";
import t from "../utils/translate";
import async from 'async';
import {Screens} from "../reducers/RootReducer";

/**
 * Controller for User Profile screen
 */
export default class ProfileContainer {

    /**
     * Binds properties and methods of this controller to related screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;

    static getComponent() {
        if (!ProfileContainer.component) {
            const item = new ProfileContainer();
            ProfileContainer.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(ProfileComponent);
        }
        return ProfileContainer.component;
    }

    /**
     * Defines which properties of global application state will be visible inside related view
     * @param state Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        // noinspection JSUnresolvedFunction
        let image = state.profile.selectedImage ? {uri: state.profile.selectedImage} :
            state.profile.image ? {uri:state.profile.image} : require("../img/default_profile.png");
        return {
            name: state.profile.name,
            image: image,
            password: state.profile.password,
            confirmPassword: state.profile.confirmPassword,
            errors: state.profile.errors
        }
    }

    /**
     * Defines which controllers methods will be available to execute from related screen
     * @returns: Array of methods
     */
    mapDispatchToProps() {
        return {
            logout: () => this.logout(),
            changeField: (name,value) => this.changeField(name,value),
            changeImage: () => this.changeImage(),
            submit: () => this.submit()
        }
    }

    /**
     * LOGOUT button onClick handler.
     */
    logout() { Backend.auth.logout(); }

    /**
     * onChange handler for text input fields in the form. Used to forward entered text in fields to application
     * state
     * @param name - Name of input field
     * @param value - current value in field
     */
    changeField(name,value) { Store.changeProperty("profile."+name,value); }

    /**
     * Method shows Image Picker screen when user taps on Profile Image
     */
    changeImage() { Store.changeProperty("activeScreen",Screens.IMAGE_PICKER); }

    /**
     * SAVE button onClick handler. Used to save profile changes to backend
     */
    submit() {
        const errors = this.validate();
        if (errors) {
            Store.changeProperty("profile.errors",errors); return;
        } else Store.changeProperties({"profile.errors":{},"activeScreen":Screens.LOADING});
        async.series([
            (callback) => {
                if (state.password.length) Backend.auth.updatePassword(state.password,callback);
                else callback();
            },
            (callback) => this.uploadProfileImage(callback),
            (callback) => {
                const user = Backend.auth.user();
                const state = Store.getState().profile;
                if (user.displayName !== state.name || user.photoURL !== state.image) {
                    Backend.auth.updateProfile({displayName: state.name,photoURL: state.image},callback);
                } else callback();
            }
        ], (error) => {
            if (error) {
                Store.changeProperties({"profile.errors": {"general": error},"activeScreen":Screens.PROFILE});
            } else {
                Store.changeProperty("activeScreen",Screens.USERS_LIST);
                Signalling.sendUserProfile()
            }
        });
    }

    /**
     * Method used to validate form data before submit.
     * @returns Object of error messages or null if no errors
     */
    validate() {
        const state = Store.getState().profile;
        const errors = {};
        if (!state.name.trim().length) errors["name"] = t("Name is required");
        if (state.password.trim() !== state.confirmPassword.trim()) errors["password"] = t("Passwords must match");
        if (Object.getOwnPropertyNames(errors).length) return errors;
        return null;
    }

    /**
     * Method used to upload new selected profile image to Backend storage. If no image selected with Image Picker
     * then function just returns without doing anything.
     * @param callback - Function called when process finished
     */
    uploadProfileImage(callback=()=>{}) {
        const state = Store.getState().profile;
        if (!state.selectedImage) { callback(); return; }
        const imageFile = Backend.auth.user().email+"-"+Date.now()+".jpg";
        let previousImageFile = decodeURIComponent(state.image).split("/").pop().split("?").shift();
        Backend.storage.deleteFile(previousImageFile, () => {
            Store.changeProperty("profile.image",Backend.storage.getFileUrl(imageFile));
            Backend.storage.putFile(imageFile,state.selectedImage,() => {
                callback();
            })
        })
    }
}