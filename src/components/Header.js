import React, {Component} from 'react';
import {Text,View,TouchableOpacity} from 'react-native';
import Styles from '../styles/Header';
import t from '../utils/translate'
import {Screens} from "../reducers/RootReducer";

export default class Header extends Component {

    /**
     * Method renders component on the screen
     * @returns Rendered component
     */
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
}
