import React, {Component} from 'react';
import {View,Text,TextInput,TouchableOpacity} from 'react-native';
import t from "../utils/translate";

export default class Register extends Component {

    render() {
        return [
            this.props.errors.general ?
                <View key={'register_general_error'}>
                    <Text>{this.props.errors.general}</Text>
                </View> : null,
            <View key={'register_login'}>
                <Text>{t("Email")}</Text>
                { this.props.errors.name ? <Text>{this.props.errors.name}</Text> : null }
                <TextInput autoCaptialize="none" autoCorrect={false}
                           value={this.props.name} onChangeText={(text) => this.props.changeField('name',text)}/>
            </View>,
            <View key={'register_password'}>
                <Text>{t("Password")}</Text>
                { this.props.errors.password ? <Text>{this.props.errors.password}</Text> : null }
                <TextInput autoCaptialize="none" autoCorrect={false} secureTextEntry={true}
                           value={this.props.password} onChangeText={(text) => this.props.changeField('password',text)}/>
            </View>,
            <View key={'register_confirmPassword'}>
                <Text>{t("Confirm Password")}</Text>
                <TextInput autoCaptialize="none" autoCorrect={false} secureTextEntry={true}
                           value={this.props.confirmPassword} onChangeText={(text) => this.props.changeField('confirmPassword',text)}/>
            </View>,
            <View key={'register_submit'}>
                <TouchableOpacity onPress={() => this.props.submit()}>
                    <View>
                        <Text>{t("Register")}</Text>
                    </View>
                </TouchableOpacity>
            </View>,
            <View key={'register_login_link'}>
                <TouchableOpacity onPress={() => this.props.goLogin()}>
                    <Text>Already registered ?</Text>
                </TouchableOpacity>
            </View>
        ]
    }
}