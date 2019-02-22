import React, {Component} from 'react';
import {View,Text,TextInput,TouchableOpacity,Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import t from '../utils/translate'
import Styles from '../styles/Login';

export default class Login extends Component {

    render() {
        // noinspection JSUnresolvedFunction
        return (
            <KeyboardAwareScrollView contentContainerStyle={Styles.scrollView}>
                <View style={Styles.logoContainer}>
                    <Image source={require("../img/logo.png")}/>
                </View>
                <View style={Styles.formContainer}>
                    {this.renderForm()}
                </View>
            </KeyboardAwareScrollView>
        )
    }

    renderForm() {
        return [
            this.props.errors.general ?
            <View key={'login_general_error'}>
                <Text style={Styles.error}>{this.props.errors.general}</Text>
            </View> : null,
            <View key={'login_login'}>
                <Text style={Styles.fieldLabelText}>{t("Login")}</Text>
                { this.props.errors.name ? <Text style={Styles.error}>{this.props.errors.name}</Text> : null }
                <TextInput autoCaptialize="none" autoCorrect={false} style={Styles.inputField}
                    value={this.props.name} onChangeText={(text) => this.props.changeField('name',text)}/>
            </View>,
            <View key={'login_password'}>
                <Text style={Styles.fieldLabelText}>{t("Password")}</Text>
                { this.props.errors.password ? <Text style={Styles.error}>{this.props.errors.password}</Text> : null }
                <TextInput autoCaptialize="none" autoCorrect={false} secureTextEntry={true} style={Styles.inputField}
                    value={this.props.password} onChangeText={(text) => this.props.changeField('password',text)}/>
            </View>,
            <TouchableOpacity onPress={() => this.props.submit()} key={'login_submit'} style={Styles.button}>
                <Text style={Styles.buttonText}>{t("L O G I N")}</Text>
            </TouchableOpacity>,
            <TouchableOpacity key={'login_register_link'} onPress={() => this.props.goRegister()} style={Styles.link}>
                <Text style={Styles.linkText}>Do not have an account ?</Text>
            </TouchableOpacity>
        ]
    }
}