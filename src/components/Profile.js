import React, {Component} from 'react';
import {Text,View,TouchableOpacity} from 'react-native';
import t from "../utils/translate";

export default class Profile extends Component {

    render() {
        return (
            <View style={{"flex":1,flexDirection:"column"}}>
                <Text>Profile</Text>
                <TouchableOpacity onPress={() => this.props.logout()}>
                    <View>
                        <Text>{t("Logout")}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )

    }
}