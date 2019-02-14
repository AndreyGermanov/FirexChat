import React, {Component} from 'react';

import {View} from 'react-native';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
} from 'react-native-webrtc';

import Store from '../store/Store';

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
        const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
        const pc = new RTCPeerConnection(configuration);
        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
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
                        minWidth: 500,
                        minHeight: 300,
                        minFrameRate: 30
                    },
                    facingMode: (isFront ? "user" : "environment"),
                    optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
                }
            })
            .then(stream => {
                Store.changeProperty("localStream",stream);
            })
            .catch(error => {
                // Log error
            });
        });
    }
}