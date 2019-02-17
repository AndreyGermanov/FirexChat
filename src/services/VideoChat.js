import Config from '../config/webrtc';
import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, MediaStream, MediaStreamTrack, mediaDevices} from 'react-native-webrtc';
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
        this.callWatcherInterval = null;
        this.connection = new RTCPeerConnection(Config.connection);
    }

    init() {
        Backend.auth.subscribe(this);
        Signalling.init();
    }

    call(userId,callback=()=>{}) {
        let state = Store.getState();
        console.log("CREATING OFFER");
        this.setupConnection(() => {
            this.connection.createOffer().then(description => {
                console.log("SETTING DESCRIPTION");
                this.connection.setLocalDescription(description).then(() => {
                    console.log("SET DESCRIPTION");
                    this.sessionOpened = true;
                    this.peerUser = userId;

                    Signalling.sendOffer(userId,description,'accept', () => {
                        console.log("SENT OFFER");
                        Store.changeProperties({
                            "activeScreen":Screens.VIDEO_CHAT,
                            "chat.mode": ChatMode.CALLING
                        });
                        console.log("WATCHING CALL");
                        if (!this.callWatcherInterval)
                            this.callWatcherInterval = setInterval(() => { console.log("ABOUT TO WATCH CALL");this.watchCall()},20000);
                    })
                })
            })
        });
    }

    watchCall() {
        console.log("WATCHING");
        let state = Store.getState();
        if (!state.chat.remoteStream || !state.chat.remoteStream._tracks ||  !state.chat.remoteStream._tracks.length || state.chat.remoteStream._tracks[0].muted) {
            console.log("HANGUP");
            let state = Store.getState();
            if (this.connection) this.connection.close();
            if (state.chat.mode === ChatMode.CALLING) {
                console.log("REJECTING OFFER");
                Signalling.sendOffer(this.peerUser,{},'reject',()=>{})
            }
            this.sessionOpened = false;
//            this.peerUser = "";
            this.iceCandidates = [];
            delete this.incomingCalls[this.peerUser];
            this.call(this.peerUser);
        } else {
            clearInterval(this.callWatcherInterval);
        }
    }

    hangup() {
        let state = Store.getState();
        if (this.connection) this.connection.close();
        if (state.chat.mode === ChatMode.CALLING) {
            console.log("REJECTING OFFER");
            Signalling.sendOffer(this.peerUser,{},'reject',()=>{})
        }
        this.sessionOpened = false;
        delete this.incomingCalls[this.peerUser];
        this.peerUser = "";
        this.iceCandidates = [];
        if (this.callWatcherInterval) clearInterval(this.callWatcherInterval);
        this.callWatcherInterval = null;
        Store.changeProperties({
            "activeScreen": Screens.USERS_LIST,
            "chat.updatesCounter": state.chat.updatesCounter+1,
            "users.updatesCounter": state.users.updatesCounter+1,
            "chat.mode": null
        })
    }

    answer(userId,answerType) {
        let state = Store.getState();
        if (!this.incomingCalls[userId] || this.sessionOpened) return;
        let data = this.incomingCalls[userId];
        if (answerType === false) {
            Signalling.sendAnswer(data.from,null,'reject');
            delete this.incomingCalls[userId];
            Store.changeProperty('users.updatesCounter',state.users.updatesCounter+1);
            return;
        }
        //if (!this.connection)
            this.connection = new RTCPeerConnection(Config.connection);
        this.setupConnection(()=> {
            this.connection.setRemoteDescription(new RTCSessionDescription(data.sdp))
                .then(() => {
                    return this.connection.createAnswer()
                })
                .then((answer) => {
                    return this.connection.setLocalDescription(answer)
                }).then(() => {
                console.log("SENDING ANSWER");
                this.peerUser = userId;
                this.sessionOpened = true;
                Signalling.sendAnswer(data.from,this.connection.localDescription,'accept');
                Store.changeProperties({
                    'activeScreen': Screens.VIDEO_CHAT,
                    'chat.mode': ChatMode.TALKING
                });

            });
        });
    }

    openLocalCamera(callback=()=>{}) {
        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                console.log(sourceInfo);
                if(sourceInfo.kind === "video" && sourceInfo.facing === (isFront ? "front" : "back")) {
                    videoSourceId = sourceInfo.id;
                }
            }
            mediaDevices.getUserMedia({
                audio: true,
                video: {
                    facingMode: (isFront ? "user" : "environment")
                }
            })
            .then(stream => {
                Store.changeProperty("chat.localStream",stream);

                this.connection.addStream(stream);
                callback();
            })
            .catch(error => {
                callback();
                // Log error
            });
        });
    }

    onAuthChange(isLogin) {
        if (isLogin) {
           this.setupConnection();
        } else {
            this.connection.close();
            Signalling.unsubscribe(this);
        }
    }

    setupConnection(callback=()=>{}) {
        const state = Store.getState();
        //if (!this.connection)
            this.connection = new RTCPeerConnection(Config.connection);
        //console.log(this.connection);
        this.openLocalCamera(() => {
            this.connection.onicecandidate = event => {
                if (this.sessionOpened && this.peerUser) {
                    console.log("RECEIVED ICE CANDIDATE");
                    Signalling.sendIceCandidate(this.peerUser,event.candidate,() => {})
                    this.iceCandidates.push(event.candidate);
                }
            };
            this.connection.onaddstream = event => {
                //if (this.sessionOpened && this.peerUser) {
                    console.log("RECEIVED REMOTE STREAM");
                    console.log(event.stream);

                    Store.changeProperty("chat.remoteStream", event.stream);
                    Store.changeProperty("chat.updatesCounter", state.chat.updatesCounter+1);
               // }
            }
            this.connection.ontrack = event => {
                //if (this.sessionOpened && this.peerUser) {
                    console.log("RECEIVED REMOTE STREAM");
                    console.log(event.streams[0]);

                    Store.changeProperty("chat.remoteStream", event.streams[0]);
                    Store.changeProperty("chat.updatesCounter", state.chat.updatesCounter+1);
                //}
            }
            Signalling.subscribe(this);
            callback();
        })
    }

    onSignal(event) {
        const state = Store.getState();
        const data = event.data;
        console.log("PROCESSING SIGNAL "+event.type);
        console.log(data);
        switch (event.type) {
            case "offer":
                if (data.type === 'reject') {
                    console.log("RECEIVED OFFER REJECT");
                    this.incomingCalls[data.from] = null;
                    delete this.incomingCalls[data.from];
                    console.log(this.incomingCalls);
                } else {
                    if (!this.sessionOpened) {
                        console.log("ADDED INCOMING CALL");
                        this.incomingCalls[data.from] = data;
                        console.log(this.incomingCalls);
                        Store.changeProperty("users.updatesCounter",state.users.updatesCounter+1);
                    }
                }
                break;
            case "answer":
                console.log(data.from+"-"+this.peerUser);
                if (data.from === this.peerUser && this.sessionOpened) {
                    if (data.type === "accept") {
                        this.connection.setRemoteDescription(new RTCSessionDescription(data.sdp))
                            .then(() => {
                                console.log("CHANGE CHAT MODE");
                                Store.changeProperty('chat.mode',ChatMode.TALKING);
                               // if (this.callWatcherInterval) clearInterval(this.callWatcherInterval);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                }
                if (data.type === 'reject') {
                    delete this.incomingCalls[data.from];
                    State.changeProperty("users.updatesCounter",state.users.updatesCounter+1);
                }
                break;
            case "iceCandidate":
                console.log("GOT ICE CANDIDATE");
                if (data.from === this.peerUser) {
                    console.log("ADD ICE CANDIDATE")
                    this.connection.addIceCandidate(new RTCIceCandidate(data.candidate)).catch((error) => {
                        console.log(error);
                    });
                }
        }
    }
};

export default VideoChat.getInstance();