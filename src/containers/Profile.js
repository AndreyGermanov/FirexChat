import ProfileComponent from '../components/Profile';
import {connect} from 'react-redux';
import Backend from '../services/Backend';
import Signalling from '../services/Signalling';
import Store from "../store/Store";
import t from "../utils/translate";
import async from 'async';
import {Screens} from "../reducers/RootReducer";

export default class ProfileContainer {

    /**
     * Binds properties and methods of this controller main screen view and returns component
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

    mapStateToProps(state) {
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

    mapDispatchToProps() {
        return {
            logout: () => this.logout(),
            changeField: (name,value) => this.changeField(name,value),
            changeImage: () => this.changeImage(),
            submit: () => this.submit()
        }
    }

    logout() {
        Backend.auth.logout();
    }

    changeField(name,value) {
        Store.changeProperty("profile."+name,value);
    }

    changeImage() {
        Store.changeProperty("activeScreen",Screens.IMAGE_PICKER);
    }

    submit() {
        const errors = this.validate();
        if (errors) {
            Store.changeProperty("profile.errors",errors);
            return;
        } else {
            Store.changeProperty("profile.errors",{});
        }
        const state = Store.getState().profile;
        const user = Backend.auth.user();
        Store.changeProperty("activeScreen",Screens.LOADING);
        async.series([
            (callback) => {
                if (state.password.length) {
                    Backend.auth.updatePassword(state.password,callback);
                } else {
                    callback();
                }
            },
            (callback) => {
                if (!state.selectedImage) { callback(); return;}
                const imageFile = user.email+"-"+Date.now()+".jpg";
                let previousImageFile = decodeURIComponent(state.image).split("/").pop().split("?").shift();
                Backend.storage.deleteFile(previousImageFile, () => {
                    Store.changeProperty("profile.image",Backend.storage.getFileUrl(imageFile));
                    Backend.storage.putFile(imageFile,state.selectedImage,() => {
                        callback();
                    })
                })
            },
            (callback) => {
                const state = Store.getState().profile;
                if (user.displayName !== state.name || user.photoURL !== state.image) {
                    Backend.auth.updateProfile({displayName: state.name,photoURL: state.image},callback)
                } else {
                    callback();
                }
            }
        ], (error) => {
            if (error) {
                Store.changeProperty("profile.errors", {"general": error});
                Store.changeProperty("activeScreen",Screens.PROFILE);
            } else {
                Store.changeProperty("activeScreen",Screens.USERS_LIST);
                Signalling.sendUserProfile()
            }
        });
    }

    validate() {
        const state = Store.getState().profile;
        const errors = {};
        if (!state.name.trim().length) errors["name"] = t("Name is required");
        if (state.password.trim() !== state.confirmPassword.trim()) errors["password"] = t("Passwords must match");
        if (Object.getOwnPropertyNames(errors).length) return errors;
        return null;
    }
}