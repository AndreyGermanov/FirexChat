import React, {Component} from 'react';
import {View,Image} from 'react-native';
import Styles from '../styles/Loading';

/**
 * Component shows Loading screen, which appears during long going exchanges with Backend
 */
export default class Loading extends Component {

    /**
     * Method renders component on the screen
     * @returns Rendered component
     */
    render() {
        // noinspection JSUnresolvedFunction
        return (
            <View style={Styles.screen}>
                <Image source={require("../img/loading.gif")} style={Styles.image} resizeMode='contain'/>
            </View>
        )
    }
}