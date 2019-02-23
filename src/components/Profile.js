import React, {Component} from 'react';
import {Text,View,TouchableOpacity,Image,TextInput} from 'react-native';
import t from "../utils/translate";
import SimpleLine from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Styles from '../styles/Profile'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

/**
 * Component shows User Profile screen
 */
export default class Profile extends Component {

    /**
     * Method renders component on the screen
     * @returns Rendered component
     */
    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={Styles.container}>
                <View style={Styles.profileImageContainer}>
                    <TouchableOpacity onPress={() => this.props.changeImage()}>
                        <Image source={this.props.image} style={Styles.profileImage}/>
                    </TouchableOpacity>
                    <Text style={Styles.profileNameText}>{this.props.name}</Text>
                </View>
                <View style={Styles.formHeader}>
                    { this.props.errors.general ? <Text style={Styles.error}>{this.props.errors.general}</Text> : null }
                    <Text style={Styles.formHeaderText}>{t("SETTINGS")}</Text>
                </View>
                <View style={Styles.profileNameContainer}>
                    <SimpleLine name="user" size={20} style={Styles.fieldIcon} color="#333333"/>
                    <View style={Styles.formFieldContainer}>
                        { this.props.errors.name ? <Text style={Styles.error}>{this.props.errors.name}</Text> : null }
                        <TextInput value={this.props.name} style={Styles.inputField}
                            onChangeText={(text) => this.props.changeField("name",text)}/>
                    </View>
                </View>
                <View style={Styles.formHeader}>
                    <Text style={Styles.formHeaderText}>{t("CHANGE PASSWORD")}</Text>
                </View>
                <View style={Styles.profileNameContainer}>
                    <Octicons name="lock" size={20} style={Styles.fieldIcon} color="#333333"/>
                    <View style={Styles.formFieldContainer}>
                        { this.props.errors.password ? <Text style={Styles.error}>{this.props.errors.password}</Text> : null }
                        <TextInput value={this.props.password} style={Styles.inputField} secureTextEntry={true}
                                   onChangeText={(text) => this.props.changeField("password",text)}/>
                    </View>
                </View>
                <View style={Styles.profileNameContainer}>
                    <Octicons name="lock" size={20} style={Styles.fieldIcon} color="#333333"/>
                    <View style={Styles.formFieldContainer}>
                        <TextInput value={this.props.confirmPassword} style={Styles.inputField} secureTextEntry={true}
                                   onChangeText={(text) => this.props.changeField("confirmPassword",text)}/>
                    </View>
                </View>
                <TouchableOpacity style={Styles.button} onPress={() => this.props.submit()}>
                    <View>
                        <Text style={Styles.buttonText}>{t("SAVE")}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.logout()} style={[Styles.button,{backgroundColor:"#990000"}]}>
                    <View>
                        <Text style={Styles.buttonText}>{t("LOGOUT")}</Text>
                    </View>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        )
    }
}
