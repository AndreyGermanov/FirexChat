import ImagePickerComponent from "../components/ImagePicker";
import {ImagePickerMode, Screens} from "../reducers/RootReducer";
import Store from '../store/Store';
import {connect} from 'react-redux';

export default class ImagePickerContainer {

    /**
     * Binds properties and methods of this controller main screen view and returns component
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

    mapStateToProps(state) {
        return {
            mode: state.imagePicker.mode,
        }
    }

    mapDispatchToProps() {
        return {
            changeMode: (mode) => this.changeMode(mode),
            selectImage: (image) => this.selectImage(image),
            submit: (cameraRef) => this.submit(cameraRef),
            cancel: () => this.cancel()
        }
    }

    changeMode(mode) {
        Store.changeProperty("imagePicker.mode",mode)
    }

    selectImage(image) {
        Store.changeProperty("profile.selectedImage",image.uri);
    }

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

    cancel() {
        Store.changeProperties({
            "activeScreen": Screens.PROFILE,
            "profile.selectedImage": ""
        })
    }
}