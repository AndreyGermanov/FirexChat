import React, {Component} from 'react';
import {ChatMode} from "../reducers/RootReducer";
import {View,TouchableOpacity,Text,Image} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import Styles from '../styles/VideoChat';

export default class VideoChat extends Component {

    render() {
        return (
            <View style={{flex:1,flexDirection:'column',backgroundColor:"#335baa"}}>
                {this.renderScreen()}
            </View>
        )
    }

    renderScreen() {
        switch(this.props.mode) {
            case ChatMode.CALLING: return this.renderCalling();
            case ChatMode.TALKING: return this.renderTalking()
        }
    }

    renderCalling() {
        // noinspection JSUnresolvedFunction
        return (
            <View style={Styles.callScreen}>
                <Text style={Styles.callScreenText}>Calling {this.props.username} ... </Text>
                <Image source={require('../img/calling.png')}/>
                <TouchableOpacity onPress={()=>this.props.hangup()}>
                    <Image source={require("../img/phone-call-reject-icon-48x48.png")}/>
                </TouchableOpacity>
            </View>
        )
    }

    renderTalking() {
        // noinspection JSUnresolvedFunction
        return [
            <RTCView objectFit='cover' key="video" style={Styles.remoteVideo}  streamURL={this.props.remoteStream}/>,
            <View key="overlay"
                  style={Styles.overlayScreen}>
                <View style={Styles.overlayScreenHeader}>
                    <Text style={Styles.usernameText}>{this.props.username}</Text>
                    <View style={Styles.localVideoFrame}>
                        <RTCView objectFit='cover' style={Styles.localVideo} streamURL={this.props.stream}/>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>this.props.hangup()} style={Styles.hangupButton}>
                    <Image source={require("../img/phone-call-reject-icon-48x48.png")}/>
                </TouchableOpacity>
            </View>
        ]
    }
}