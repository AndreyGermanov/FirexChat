import React, {Component} from 'react';
import {View,Image} from 'react-native';
import Styles from '../styles/Loading';

export default class Loading extends Component {

    render() {
        // noinspection JSUnresolvedFunction
        return (
            <View style={Styles.screen}>
                <Image source={require("../img/loading.gif")} style={Styles.image} resizeMode='contain'/>
            </View>
        )
    }
}