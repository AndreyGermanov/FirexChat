import React, {Component} from 'react';
import {Text,View,TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import CameraRollPicker from 'react-native-camera-roll-picker';
import {ImagePickerMode} from "../reducers/RootReducer";
import t from '../utils/translate';
import Styles from "../styles/ImagePicker";

/**
 * Component used to set user profile picture. It allows either to take picture from camera or choose it
 * from picture library
 */
export default class ImagePicker extends Component {

    /**
     * Method renders component on the screen
     * @returns Rendered component
     */
    render() {
        return (
            <View style={{flex:1,flexDirection:'column',width:'100%',height:'100%'}}>
                {this.renderMenu()}
                {this.props.mode === ImagePickerMode.CAMERA ? this.renderCamera() : this.renderLibrary()}
                {this.renderButtons()}
            </View>
        )
    }

    /**
     * Method renders Top navigation menu, to switch between "Camera" and "Library"
     * @returns Rendered component
     */
    renderMenu() {
        return (
            <View style={Styles.header}>
                <View style={Styles.menu}>
                    {this.renderMenuItem(t("CAMERA"),Styles.menuItemLeft,
                        this.props.mode === ImagePickerMode.CAMERA,() => this.props.changeMode(ImagePickerMode.CAMERA))
                    }
                    {this.renderMenuItem(t("LIBRARY"),Styles.menuItemRight,
                        this.props.mode === ImagePickerMode.LIBRARY,() => this.props.changeMode(ImagePickerMode.LIBRARY))
                    }
                </View>
            </View>
        )
    }

    /**
     * Renders individual tab in menu
     * @param text - Text of menu item
     * @param style - Style of menu item container
     * @param isActive - True if this tab is active
     * @param onClick - Function, which acts as onClick event handler for this menu item
     * @returns Rendered component
     */
    renderMenuItem(text,style,isActive,onClick) {
        return (
            <TouchableOpacity style={[style,{backgroundColor:isActive ? 'white' : '#d9935f' }]} onPress={()=>onClick()}>
                <Text style={Styles.menuItemText}>{text}</Text>
            </TouchableOpacity>
        )
    }

    /**
     * Method shows "CAMERA" tab content - e.g. Camera preview screen
     * @returns Rendered component
     */
    renderCamera() {
        return (
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={{flex:1,flexDirection:'column'}}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                permissionDialogTitle={'Permission to use camera'}
                permissionDialogMessage={'We need your permission to use your camera phone'}
            />
        )
    }

    /**
     * Method shows Picture library to choose image from on "LIBRARY" tab
     * @returns Rendered component
     */
    renderLibrary() {
        return (
            <CameraRollPicker callback={(images) => { this.props.selectImage(images[0])}} selectSingleItem={true}/>
        )
    }

    /**
     * Method shows button bar on the bottom on the screen, which allows to take a picture, select an image or cancel
     * @returns Rendered component
     */
    renderButtons() {
        return (
            <View style={Styles.buttonBar}>
                <TouchableOpacity onPress={()=>this.props.submit(this.camera)}
                      style={Styles.button}>
                    <Text style={Styles.buttonText}>{t("SELECT")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.cancel()}
                                  style={Styles.button}>
                    <Text style={Styles.buttonText}>{t("CANCEL")}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}