import Config from '../config/webrtc';
import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, mediaDevices} from 'react-native-webrtc';
import Backend from './Backend';
import Signalling from './Signalling'
import Store from "../store/Store";
import {Screens,ChatMode} from "../reducers/RootReducer";

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
        this.iceCandidates = [];
        this.incomingCalls = {};
        this.localStream = null;
        this.remoteStream = null;
    }

    init() {
        Backend.auth.subscribe(this);
        Signalling.init();
    }

    call(userId) {
        this.peerUser = userId;
        this.sessionOpened = true;
        this.iceCandidates = [];
        Store.changeProperties({"activeScreen":Screens.VIDEO_CHAT, "chat.mode": ChatMode.CALLING});
        Signalling.sendCallRequest(userId);
    }

    acceptCall(userId) {
        this.peerUser = userId;
        this.sessionOpened = true;
        this.iceCandidates = [];
        Store.changeProperties({"activeScreen":Screens.VIDEO_CHAT, "chat.mode": ChatMode.CALLING});
        Signalling.sendCallResponse(userId,true);
    }

    rejectCall(userId) {
        delete this.incomingCalls[userId];
        let state = Store.getState();
        Store.changeProperties({"activeScreen":Screens.USERS_LIST, "users.updatesCounter": state.users.updatesCounter+1});
        Signalling.sendCallResponse(userId,false);
    }

    sendOffer(userId,callback=()=>{}) {
        this.setupConnection(() => {
            this.connection.createOffer()
            .then(description => {
                this.connection.setLocalDescription(description)
                .then(() => {
                    Signalling.sendOffer(userId,description,'accept');
                    callback();
                })
            })
        });
    }

    sendAnswer(userId,offerSdp,callback=()=>{}) {
        this.setupConnection(()=> {
            this.connection.setRemoteDescription(new RTCSessionDescription(offerSdp))
            .then(() => { return this.connection.createAnswer() })
            .then((answer) => { return this.connection.setLocalDescription(answer) })
            .then(() => {
                Signalling.sendAnswer(userId,this.connection.localDescription,'accept');
                this.iceCandidates.forEach(candidate => Signalling.sendIceCandidate(userId,candidate));
                Store.changeProperty("activeScreen",Screens.VIDEO_CHAT);
                callback();
            });
        })
    }

    setupConnection(callback=()=>{}) {
        const state = Store.getState();
        this.connection = new RTCPeerConnection(Config.connection);
        this.openLocalCamera(() => {

            this.connection.onicecandidate = event => {
                if (!event.candidate || !this.sessionOpened) return;
                Signalling.sendIceCandidate(this.peerUser,event.candidate);
                this.iceCandidates.push(event.candidate);
            };

            this.connection.onaddstream = event => {
                this.remoteStream = event.stream;
                Store.changeProperty("chat.updatesCounter", state.chat.updatesCounter+1);
            };
            callback();
        })
    }

    openLocalCamera(callback=()=>{}) {
        if (this.localStream != null) { this.addLocalStream(this.localStream,callback); return; }
        mediaDevices.getUserMedia({
            audio: true,
            video: {
                facingMode: "user"
            } })
        .then(stream => this.addLocalStream(stream,callback))
        .catch(error => {
            if (this.localStream != null) this.addLocalStream(this.localStream,callback);
        });
    }

    addLocalStream(stream,callback) {
        let state = Store.getState();
        this.localStream = stream;
        this.connection.addStream(stream);
        Store.changeProperty("chat.updatesCounter",state.chat.updatesCounter+1);
        callback();
    }

    onAuthChange(isLogin) {
        if (isLogin) {
            Signalling.subscribe(this);
        } else {
            this.eraseConnection();
            Signalling.unsubscribe(this);
        }
    }

    onSignal(event) {
        switch (event.type) {
            case "call":              this.onCall(event.data); break;
            case "call_response":     this.onCallResponse(event.data); break;
            case "video_offer":       this.onVideoOffer(event.data); break;
            case "video_answer":      this.onVideoAnswer(event.data); break;
            case "new_ice_candidate": this.onNewIceCandidate(event.data);
        }
    }

    onCall(data) {
        const state = Store.getState();
        this.incomingCalls[data.from] = data;
        Store.changeProperty("users.updatesCounter",state.users.updatesCounter+1);
    }

    onCallResponse(data) {
        const state = Store.getState();
        if (data.answer === "reject") {
            delete this.incomingCalls[data.from];
            if (data.from === this.peerUser) {
                this.eraseSession();
                Store.changeProperty("activeScreen", Screens.USERS_LIST);
            }
            Store.changeProperty("users.updatesCounter", state.users.updatesCounter + 1);
        } else {
            this.sendOffer(data.from)
        }
    }

    onVideoOffer(data) {
        if (this.peerUser !== data.from || !this.sessionOpened) return;
        if (data.answer_type === 'reject') { this.hangup(); return;}
        this.sendAnswer(this.peerUser,data.sdp);
    }

    onVideoAnswer(data) {
        if (data.from !== this.peerUser || !this.sessionOpened) return;
        this.connection.setRemoteDescription(new RTCSessionDescription(data.sdp))
        .then(() => {
            this.iceCandidates.forEach((candidate) => Signalling.sendIceCandidate(this.peerUser,candidate));
            Store.changeProperty('chat.mode',ChatMode.TALKING);
        })
    }

    onNewIceCandidate(data) {
        if (data.from !== this.peerUser || !this.sessionOpened) return;
        this.connection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }

    hangup() {
        this.eraseConnection();
        Store.changeProperties({"activeScreen": Screens.USERS_LIST, "chat.mode": null})
    }

    eraseConnection() {
        const state = Store.getState()
        if (this.connection) this.connection.close();
        if (state.chat.mode === ChatMode.TALKING) {
            Signalling.sendOffer(this.peerUser,{},'reject',()=>{})
        } else {
            Signalling.sendCallResponse(this.peerUser,false);
        }
        this.eraseSession();
    }

    eraseSession() {
        delete this.incomingCalls[this.peerUser];
        this.sessionOpened = false;
        this.peerUser = "";
        this.iceCandidates = [];
    }
}

export default VideoChat.getInstance();