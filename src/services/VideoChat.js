import Config from '../config/webrtc';
import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, mediaDevices} from 'react-native-webrtc';
import Backend from './Backend';
import Signalling from './Signalling'
import Store from "../store/Store";
import {Screens,ChatMode} from "../reducers/RootReducer";
import Audio from '../services/Audio';

/**
 * VideoChat WebRTC service. Used to communication with TURN and WebSocket server to make calls and
 * receive answers
 */
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

    /**
     * Class constructor
     */
    constructor() {
        this.sessionOpened = false;
        this.peerUser = "";
        this.iceCandidates = [];
        this.incomingCalls = {};
        this.localStream = null;
        this.remoteStream = null;
    }

    /**
     * Initialization method
     */
    init() {
        Backend.auth.subscribe(this);
        Signalling.init();
    }

    /**
     * Method initiates call request to specified user
     * @param userId - ID of user to call to
     */
    call(userId) {
        if (!this.isOnline()) return;
        this.peerUser = userId;
        this.sessionOpened = true;
        this.iceCandidates = [];
        Store.changeProperties({"activeScreen":Screens.VIDEO_CHAT, "chat.mode": ChatMode.CALLING});
        Signalling.sendCallRequest(userId);
        Audio.playLoop('call.mp3',5000);
    }

    /**
     * Method sends Accept call message to specified user
     * @param userId - ID of user to respond to
     */
    acceptCall(userId) {
        if (!this.isOnline()) return;
        this.peerUser = userId;
        this.sessionOpened = true;
        this.iceCandidates = [];
        Store.changeProperties({"activeScreen":Screens.VIDEO_CHAT, "chat.mode": ChatMode.TALKING});
        Signalling.sendCallResponse(userId,true);
        Audio.stopLoop('ring.mp3');
    }


    /**
     * Method sends Reject call message to specified user
     * @param userId - ID of user to respond to
     */
    rejectCall(userId) {
        if (!this.isOnline()) return;
        delete this.incomingCalls[userId];
        let state = Store.getState();
        Store.changeProperties({"activeScreen":Screens.USERS_LIST, "users.updatesCounter": state.users.updatesCounter+1});
        Signalling.sendCallResponse(userId,false);
        Audio.stopLoop('ring.mp3');
    }

    /**
     * Method used to create and send WebRTC offer to specified user
     * @param userId - ID of destination user
     * @param callback - Function runs when operation finished
     */
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

    /**
     * Method used to create and send WebRTC answer to specified user
     * @param userId - ID of destination user
     * @param offerSdp - Description of offer, received from destination user
     * @param callback - Function runs when operation finished
     */
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

    /**
     * Method used to create WebRTC connection
     * @param callback - Function runs when operation finished
     */
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

    /**
     * Method used to construct local media stream from user equipment: Camera and Microphone
     * @param callback - Function runs when operation finished
     */
    openLocalCamera(callback=()=>{}) {
        if (this.localStream != null) { this.addLocalStream(this.localStream,callback); return; }
        mediaDevices.getUserMedia({
            audio: true,
            video: {
                facingMode: "user"
            } })
        .then(stream => this.addLocalStream(stream,callback))
        .catch(() => {
            if (this.localStream != null) this.addLocalStream(this.localStream,callback);
        });
    }

    /**
     * Method used to add local media stream to WebRTC connection
     * @param stream - Stream object to add
     * @param callback - Function runs when operation finished
     */
    addLocalStream(stream,callback) {
        let state = Store.getState();
        this.localStream = stream;
        this.connection.addStream(stream);
        Store.changeProperty("chat.updatesCounter",state.chat.updatesCounter+1);
        callback();
    }

    /**
     * Subscription method which runs when user authentication status changes
     * @param isLogin - True if user signs in and False if user sings out
     */
    onAuthChange(isLogin) {
        if (isLogin) {
            Signalling.subscribe(this);
        } else {
            this.eraseConnection();
            Signalling.unsubscribe(this);
        }
    }

    /**
     * Subscription method, which runs when new event from Signalling (websocket) server arrived
     * @param event - Received event message
     */
    onSignal(event) {
        switch (event.type) {
            case "call":              this.onCall(event.data); break;
            case "call_response":     this.onCallResponse(event.data); break;
            case "video_offer":       this.onVideoOffer(event.data); break;
            case "video_answer":      this.onVideoAnswer(event.data); break;
            case "new_ice_candidate": this.onNewIceCandidate(event.data); break;
            case "connection_status": this.onConnectionStatus(event.data);
        }
    }

    /**
     * Method used to respond on Call messages
     * @param data - Message data
     */
    onCall(data) {
        const state = Store.getState();
        this.incomingCalls[data.from] = data;
        Store.changeProperty("users.updatesCounter",state.users.updatesCounter+1);
        Audio.playLoop('ring.mp3',5000);
    }

    /**
     * Method used to respond on Call response messages
     * @param data - Message data
     */
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
        Audio.stopLoop();
    }

    /**
     * Method used to respond to WebRTC offer messages
     * @param data - Message data
     */
    onVideoOffer(data) {
        if (this.peerUser !== data.from || !this.sessionOpened) return;
        if (data.answer_type === 'reject') { this.hangup(); return;}
        this.sendAnswer(this.peerUser,data.sdp);
    }

    /**
     * Method used to respond to WebRTC answer messages
     * @param data - Message data
     */
    onVideoAnswer(data) {
        if (data.from !== this.peerUser || !this.sessionOpened) return;
        this.connection.setRemoteDescription(new RTCSessionDescription(data.sdp))
        .then(() => {
            this.iceCandidates.forEach((candidate) => Signalling.sendIceCandidate(this.peerUser,candidate));
            Store.changeProperty('chat.mode',ChatMode.TALKING);
        })
    }

    /**
     * Method used to respond to ICE candidate messages
     * @param data - Message data
     */
    onNewIceCandidate(data) {
        if (data.from !== this.peerUser || !this.sessionOpened) return;
        this.connection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }

    /**
     * Method used to respond on WebSocket connection status change event
     */
    onConnectionStatus() {
        const state = Store.getState();
        if (!this.isOnline()) {
            this.hangup();
        } else {
            Store.changeProperty("users.updatesCounter",state.users.updatesCounter+1)
        }
    }

    /**
     * Method used to break current WebRTC connection and return user to Users List screen
     */
    hangup() {
        const state = Store.getState();
        this.eraseConnection();
        Audio.stopLoop();
        if (state.activeScreen === Screens.VIDEO_CHAT) Audio.play('hangup.mp3');
        Store.changeProperties({
            "activeScreen": Screens.USERS_LIST,
            "chat.mode": null,
            "users.updatesCounter": state.users.updatesCounter+1
        })
    }

    /**
     * Method used to remove all data, related to current connection and notify connection peer about this
     */
    eraseConnection() {
        const state = Store.getState();
        if (this.connection) this.connection.close();
        if (this.peerUser) {
            if (state.chat.mode === ChatMode.TALKING) {
                Signalling.sendOffer(this.peerUser, {}, 'reject', () => {
                })
            } else {
                Signalling.sendCallResponse(this.peerUser, false);
            }
        }
        this.eraseSession();
    }

    /**
     * Method used to remove all Session information about current connection
     */
    eraseSession() {
        delete this.incomingCalls[this.peerUser];
        this.sessionOpened = false;
        this.peerUser = "";
        this.iceCandidates = [];
    }

    /**
     * Returns current WebSocket server connection status
     * @returns True if connected and false otherwise
     */
    isOnline() { return Signalling.isOnline()}
}

export default VideoChat.getInstance();