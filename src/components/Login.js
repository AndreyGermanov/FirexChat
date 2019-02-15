import React, {Component} from 'react';
import {View,Text,TextInput,TouchableOpacity} from 'react-native';
import t from '../utils/translate'

export default class Login extends Component {

    render() {
        return [
            this.props.errors.general ?
            <View key={'login_general_error'}>
                <Text>{this.props.errors.general}</Text>
            </View> : null,
            <View key={'login_login'}>
                <Text>{t("Login")}</Text>
                { this.props.errors.name ? <Text>{this.props.errors.name}</Text> : null }
                <TextInput autoCaptialize="none" autoCorrect={false}
                    value={this.props.name} onChangeText={(text) => this.props.changeField('name',text)}/>
            </View>,
            <View key={'login_password'}>
                <Text>{t("Password")}</Text>
                { this.props.errors.password ? <Text>{this.props.errors.password}</Text> : null }
                <TextInput autoCaptialize="none" autoCorrect={false} secureTextEntry={true}
                    value={this.props.password} onChangeText={(text) => this.props.changeField('password',text)}/>
            </View>,
            <View key={'login_submit'}>
                <TouchableOpacity onPress={() => this.props.submit()}>
                    <View>
                        <Text>{t("Login")}</Text>
                    </View>
                </TouchableOpacity>
            </View>,
            <View key={'login_register_link'}>
                <TouchableOpacity onPress={() => this.props.goRegister()}>
                    <Text>Do not have an account ?</Text>
                </TouchableOpacity>
            </View>
        ]
    }
}