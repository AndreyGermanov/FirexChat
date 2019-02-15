import Signalling from './Signalling';
import Config from '../config/webrtc';
import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, MediaStream, MediaStreamTrack, mediaDevices} from 'react-native-webrtc';
import Backend from '../services/Backend';
import Store from "../store/Store";
import {Screens} from "../reducers/RootReducer";

class VideoChat {

    /**
     * Returns single instance of this service
     * @returns Instance of service
     */
    static instance = null;

    static getInstance() {
        if (!VideoChat.instance) VideoChat.instance = new VideoChat();
        return VideoChat.instance;
    }

    constructor() {
        this.sessionOpened = false;
        this.peerUser = "";
        this.incomingCalls = {};
        this.connection = new RTCPeerConnection(Config.connection);
    }

    init() {
        Backend.auth.subscribe(this);
    }

    call(userId,callback) {
        this.sessionOpened = true;
        this.peerUser = userId;
        this.connection.createOffer().then( description => {
            this.connection.setLocalDescription(description).then(() => {
                Backend.db.putItem('offers',null,{from: Backend.auth.user().email,to:userId,sdp:description}, ()=> {
                    Store.changeProperty("activeScreen",Screens.VIDEO_CHAT)
                });
            })
        })
    }

    hangup() {
        let state = Store.getState();
        this.connection.close()
        this.sessionOpened = false;
        this.peerUser = "";
        Store.changeProperties({
            "activeScreen": Screens.USERS_LIST,
            "updatesCounter": state.chat.updatesCounter+1
        })
    }

    openLocalCamera() {
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
                Store.changeProperty("chat.localStream",stream);
            })
            .catch(error => {
                // Log error
            });
        });
    }

    onAuthChange(isLogin) {
        if (isLogin) {
            this.connection.onicecandidate = event => {
                if (this.sessionOpened && this.peerUser) {
                    Backend.db.putItem('iceCandidates',null,{from: Backend.auth.user().email,to:this.peerUser,candidate:event.candidate});
                }
            };
            this.connection.onaddstream = event => {
                if (this.sessionOpened && this.peerUser) {
                    Store.changeProperty("chat.remoteStream", event.stream);
                }
            }
            Backend.db.subscribe(this,'offers',['to','==',Backend.auth.user().email]);
            Backend.db.subscribe(this,'answers',['to','==',Backend.auth.user().email]);
            Backend.db.subscribe(this,'iceCandidates',['to','==',Backend.auth.user().email]);
        } else {
            this.connection.close();
            Backend.db.unsubscribe(this,'offers');
            Backend.db.unsubscribe(this,'answers');
            Backend.db.unsubscribe(this,'iceCandidates');
        }
    }

    onDatabaseChange(collection,change) {
        if (change.type !== "added") return;
        const data = change.data;
        switch (collection) {
            case "offers":
                if (!this.sessionOpened) {
                    this.incomingCalls[data.from] = data;
                }
                break;
            case "answers":
                if (data.from === this.peerUser) {
                    this.connection.setRemoteDescription(data.sdp);
                }
                break;
            case "iceCandidates":
                if (data.from === this.peerUser) {
                    this.connection.addIceCandidate(data.candidate);
                }
        }
        Backend.db.deleteItem(collection,change.data.id);
    }
};

export default VideoChat.getInstance();