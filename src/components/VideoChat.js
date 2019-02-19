import React, {Component} from 'react';
import {ChatMode} from "../reducers/RootReducer";
import {View,TouchableOpacity,Text} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import t from '../utils/translate'

export default class VideoChat extends Component {

    render() {
        return (
            <View style={{flex:1,flexDirection:'column'}}>
                <RTCView style={{flex:1,flexDirection:'row'}}  streamURL={this.props.remoteStream ? this.props.remoteStream.toURL() : null}>
                </RTCView>
                <View style={{paddingBottom:10,position:'absolute',flex:1,width:'100%',height:'100%',zIndex:500,flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end'}}>
                    <TouchableOpacity onPress={()=>this.props.hangup()}>
                        <Text>{t("Hang up")}</Text>
                    </TouchableOpacity>
                    <RTCView style={{width:200,height:200,zIndex:600}} streamURL={this.props.stream ? this.props.stream.toURL() : null}>
                    </RTCView>
                </View>
            </View>
        );
    }

    renderBackground() {
        if (this.props.mode === ChatMode.CALLING)
            return <View style={{flex:1,flexDirection:'row',backgroundColor:"#006600"}}>
            </View>
        if (this.props.mode === ChatMode.TALKING)
            return <RTCView style={{flex:1,flexDirection:'row'}}  streamURL={this.props.remoteStream ? this.props.remoteStream.toURL() : null}>
            </RTCView>


    }
}