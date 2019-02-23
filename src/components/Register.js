import React from 'react';
import Login from './Login';
import {View,Text,TextInput,TouchableOpacity} from 'react-native';
import t from "../utils/translate";
import Styles from '../styles/Login';

/**
 * Component shows user Sign Up from
 */
export default class Register extends Login {

    /**
     * Method renders User register form
     * @returns Rendered component
     */
    renderForm() {
        return [
            this.props.errors.general ?
                <View key={'register_general_error'}>
                    <Text style={Styles.error}>{this.props.errors.general}</Text>
                </View> : null,
            <View key={'register_login'}>
                <Text style={Styles.fieldLabelText}>{t("Email")}</Text>
                { this.props.errors.name ? <Text style={Styles.error}>{this.props.errors.name}</Text> : null }
                <TextInput autoCaptialize="none" autoCorrect={false} style={Styles.inputField}
                           value={this.props.name} onChangeText={(text) => this.props.changeField('name',text)}/>
            </View>,
            <View key={'register_password'}>
                <Text style={Styles.fieldLabelText}>{t("Password")}</Text>
                { this.props.errors.password ? <Text style={Styles.error}>{this.props.errors.password}</Text> : null }
                <TextInput autoCaptialize="none" autoCorrect={false} secureTextEntry={true}  style={Styles.inputField}
                           value={this.props.password} onChangeText={(text) => this.props.changeField('password',text)}/>
            </View>,
            <View key={'register_confirmPassword'}>
                <Text style={Styles.fieldLabelText}>{t("Confirm Password")}</Text>
                <TextInput autoCaptialize="none" autoCorrect={false} secureTextEntry={true}  style={Styles.inputField}
                           value={this.props.confirmPassword} onChangeText={(text) => this.props.changeField('confirmPassword',text)}/>
            </View>,
            <TouchableOpacity onPress={() => this.props.submit()} key={'register_submit'} style={Styles.button}>
                <Text style={Styles.buttonText}>{t("R E G I S T E R")}</Text>
            </TouchableOpacity>,
            <TouchableOpacity onPress={() => this.props.goLogin()} key={'register_login_link'} style={Styles.link}>
                <Text style={Styles.linkText}>Already registered ?</Text>
            </TouchableOpacity>
        ]
    }
}