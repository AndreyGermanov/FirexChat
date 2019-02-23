import React, {Component} from 'react';
import {ChatMode} from "../reducers/RootReducer";
import {View,TouchableOpacity,Text,Image} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import Styles from '../styles/VideoChat';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

/**
 * Video Chat display component. Appears when user calls somebody or answers to the call.
 */
export default class VideoChat extends Component {

    /**
     * Method renders component on the screen
     * @returns Rendered component
     */
    render() {
        return (
            <View style={{flex:1,flexDirection:'column',backgroundColor:"#335baa"}}>
                {this.renderScreen()}
            </View>
        )
    }

    /**
     * Method used to render content of screen based on current mode (either answer waiting screen
     * or video stream screen)
     * @returns Rendered component
     */
    renderScreen() {
        switch(this.props.mode) {
            case ChatMode.CALLING: return this.renderCalling();
            case ChatMode.TALKING: return this.renderTalking()
        }
    }

    /**
     * Method used to render "Calling ..." screen, which appears when user wait for an answer
     * @returns Rendered component
     */
    renderCalling() {
        // noinspection JSUnresolvedFunction
        return (
            <KeyboardAwareScrollView contentContainerStyle={Styles.callScreen}>
                <Text style={Styles.callScreenText}>{this.props.username} ... </Text>
                <Image source={require('../img/calling.png')}/>
                <TouchableOpacity onPress={()=>this.props.hangup()}>
                    <Image source={require("../img/phone-call-reject-icon-48x48.png")}/>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        )
    }

    /**
     * Method used to render Video chat screen with remote participant video and local video preview
     * @returns Rendered component
     */
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