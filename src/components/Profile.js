import React, {Component} from 'react';
import {Text,View,TouchableOpacity,Image,TextInput} from 'react-native';
import t from "../utils/translate";
import SimpleLine from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Styles from '../styles/Profile'

export default class Profile extends Component {

    render() {
        return (
            <View style={Styles.container}>
                <View style={Styles.profileImageContainer}>
                    <Image source={this.props.image} style={Styles.profileImage}/>
                    <Text style={Styles.profileNameText}>{this.props.name}</Text>
                </View>
                <View style={Styles.formHeader}>
                    <Text style={Styles.formHeaderText}>{t("SETTINGS")}</Text>
                </View>
                <View style={Styles.profileNameContainer}>
                    <SimpleLine name="user" size={20} color="#333333"/>
                    <TextInput value={this.props.name} style={Styles.inputField}/>
                </View>
                <View style={Styles.profileEmailContainer}>
                    <Octicons name="mail" size={20} color="#333333"/>
                    <TextInput value={this.props.email} style={Styles.inputField}/>
                </View>
                <TouchableOpacity style={Styles.button}>
                    <View>
                        <Text style={Styles.buttonText}>{t("SAVE")}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.logout()} style={[Styles.button,{backgroundColor:"#990000"}]}>
                    <View>
                        <Text style={Styles.buttonText}>{t("LOGOUT")}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
