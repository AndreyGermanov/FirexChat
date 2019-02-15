import React, {Component} from 'react';

import {View} from 'react-native';
import {RTCView} from 'react-native-webrtc';

export default class VideoChat extends Component {

    render() {
        return (
            <View style={{flex:1,flexDirection:'column'}}>
                <View style={{flex:1,flexDirection:'row',backgroundColor:"#006600"}}>
                </View>
                <View style={{paddingBottom:10,position:'absolute',flex:1,width:'100%',height:'100%',flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
                    <RTCView style={{width:200,height:200}} streamURL={this.props.stream ? this.props.stream.toURL() : null}>
                    </RTCView>
                </View>
            </View>
        );
    }

    componentDidMount() {
        this.props.openLocalCamera();
    }
}