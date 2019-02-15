import React, {Component} from 'react';
import {Text,View,TouchableOpacity} from 'react-native';
import t from '../utils/translate'

export default class Header extends Component {

    render() {
        return (
            <View style={{flex:1,flexDirection:"row"}}>
                <TouchableOpacity onPress={()=>this.props.gotoUsers()}>
                    <Text>{t("Users")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.gotoProfile()}>
                    <Text>{t("Profile")}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}