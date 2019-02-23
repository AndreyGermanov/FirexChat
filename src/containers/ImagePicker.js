import ImagePickerComponent from "../components/ImagePicker";
import {ImagePickerMode, Screens} from "../reducers/RootReducer";
import Store from '../store/Store';
import {connect} from 'react-redux';

/**
 * Controller for Image Picker component
 */
export default class ImagePickerContainer {

    /**
     * Binds properties and methods of this controller to related screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;

    static getComponent() {
        if (!ImagePickerContainer.component) {
            const item = new ImagePickerContainer();
            ImagePickerContainer.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(ImagePickerComponent);
        }
        return ImagePickerContainer.component;
    }

    /**
     * Defines which properties of global application state will be visible inside related view
     * @param state Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return {
            mode: state.imagePicker.mode,
        }
    }

    /**
     * Defines which controllers methods will be available to execute from related screen
     * @returns: Array of methods
     */
    mapDispatchToProps() {
        return {
            changeMode: (mode) => this.changeMode(mode),
            selectImage: (image) => this.selectImage(image),
            submit: (cameraRef) => this.submit(cameraRef),
            cancel: () => this.cancel()
        }
    }

    /**
     * Method used to change mode of Image Picker: CAMERA or LIBRARY
     * @param mode: Mode to set. It is a constant ImagePickerMode.CAMERA or ImagePickerMode.LIBRARY
     */
    changeMode(mode) {
        Store.changeProperty("imagePicker.mode",mode)
    }

    /**
     * Method used as an onClick handler when user selects image from image LIBRARY.
     * @param image - Selected image object
     */
    selectImage(image) {
        if (!image) return;
        Store.changeProperty("profile.selectedImage",image.uri);
    }

    /**
     * "SELECT" button onClick handler. Used to take picture from CAMERA and pass it to User profile screen
     * or just pass currently selected image from LIBRARY to User profile screen
     * @param cameraRef - Link to CAMERA object used to take a picture
     */
    async submit (cameraRef) {
        let state = Store.getState().imagePicker;
        if (state.mode === ImagePickerMode.CAMERA) {
            let image = await cameraRef.takePictureAsync();
            Store.changeProperties({
                "profile.selectedImage": image.uri,
                "activeScreen": Screens.PROFILE
            });
        } else {
            Store.changeProperty("activeScreen",Screens.PROFILE)
        }
    }

    /**
     * "CANCEL" button onClick handler. Erases currently selected image and returns to User profile screen
     */
    cancel() {
        Store.changeProperties({
            "activeScreen": Screens.PROFILE,
            "profile.selectedImage": ""
        })
    }
}