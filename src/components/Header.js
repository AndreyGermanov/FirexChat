import React, {Component} from 'react';
import {Text,View,TouchableOpacity} from 'react-native';
import Styles from '../styles/Header';
import t from '../utils/translate'
import {Screens} from "../reducers/RootReducer";

export default class Header extends Component {

    render() {
        return (
            <View style={Styles.header}>
                <View style={Styles.menu}>
                    {this.renderMenuItem(t("USERS"),Styles.menuItemLeft,
                        this.props.activeScreen === Screens.USERS_LIST,this.props.gotoUsers)
                    }
                    {this.renderMenuItem(t("PROFILE"),Styles.menuItemRight,
                        this.props.activeScreen === Screens.PROFILE,this.props.gotoProfile)
                    }
                </View>
            </View>
        )
    }

    renderMenuItem(text,style,isActive,onClick) {
        return (
        <TouchableOpacity style={[style,{backgroundColor:isActive ? 'white' : '#d9935f' }]} onPress={()=>onClick()}>
            <Text style={Styles.menuItemText}>{text}</Text>
        </TouchableOpacity>
        )
    }
}
