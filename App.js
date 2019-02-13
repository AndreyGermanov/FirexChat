/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
} from 'react-native-webrtc';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

    constructor(props) {
        super(props)
        this.state = {stream:null}
    }

    render() {
        console.log("RERENDER");
        console.log(this.state.stream ? this.state.stream .toURL() : "NULL");
        return (
            <View style={{flex:1,flexDirection:'column'}}>
                <View style={{flex:1,flexDirection:'row',backgroundColor:"#006600"}}>
                </View>
                <View style={{paddingBottom:10,position:'absolute',flex:1,width:'100%',height:'100%',flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
                    <RTCView style={{width:200,height:200}} streamURL={this.state.stream ? this.state.stream.toURL() : null}>
                    </RTCView>
                </View>
            </View>
        );
    }

    componentDidMount() {
        const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
        const pc = new RTCPeerConnection(configuration);

        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
                    videoSourceId = sourceInfo.id;
                }
            }
            mediaDevices.getUserMedia({
                audio: true,
                video: {
                    mandatory: {
                        minWidth: 500, // Provide your own width, height and frame rate here
                        minHeight: 300,
                        minFrameRate: 30
                    },
                    facingMode: (isFront ? "user" : "environment"),
                    optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
                }
            })
                .then(stream => {
                    console.log("GOT STREAM");
                    this.setState({stream:stream});
                })
                .catch(error => {
                    // Log error
                });
        });
    }
}

