import Backend from './Backend'
import Service from './Service';
import WebSocketConfig from '../config/websocket';
import _ from 'lodash';

/**
 * Service used as a client for WebRTC signalling server. Used by VideoChat module exchange
 * WebRTC related information: offers, answers, ICE candidates and also to initiate and reject video calls
 */
class Signalling extends Service {

    /**
     * Returns single instance of this service
     * @returns Instance of service
     */
    static instance = null;

    static getInstance() {
        if (!Signalling.instance) Signalling.instance = new Signalling();
        return Signalling.instance;
    }

    constructor() {
        super()
        this.user = null;
        this.messageQueue = [];
        this.getMessagesInterval = null;
        this.tryConnectInterval = null;
        this.connectionStatus = null;
    }

    init() {
        Backend.auth.subscribe(this);
    }

    connect() {
        this.connection = new WebSocket(WebSocketConfig.url);
        this.connection.onopen = () => {
            if (this.getMessagesInterval === null) {
                this.getMessagesInterval = setInterval(() => {
                    this.sendMessage({type:"get_messages",from:this.user})
                }, 5000);
            }
        };

        this.connection.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (typeof(message["type"]) !== "undefined" && message["type"] !== null) {
                this.triggerEvent("onSignal",[{type:message.type,data:message}]);
            }
        };

    }

    onAuthChange(isLogin) {
        if (isLogin) {
            this.user = Backend.auth.user().email;
            if (!this.tryConnectInterval) {
                this.tryConnectInterval = setInterval(() => {
                    if (!this.connection || this.connection.readyState !== this.connection.OPEN) {
                        this.connect();
                    }
                    if (this.connection.readyState === 1) {
                        this.sendMessageQueue();
                    }
                },5000);
            }
        } else {
            clearInterval(this.getMessagesInterval);
            clearInterval(this.tryConnectInterval);
            this.getMessagesInterval = null;
            this.tryConnectInterval = null;
            if (this.connection) this.connection.close();
        }
    }

    sendCallRequest(userId) {
        const message = {type:'call',from:this.user,to:userId};
        this.sendMessage(message);
    }

    sendCallResponse(userId,responseType) {
        const message = {type:'call_response',from:this.user,to:userId,answer:responseType ? 'accept' : 'reject'};
        this.sendMessage(message);
    }

    sendOffer(userId,sdp,answer_type) {
        const message = {type:'video_offer',from:this.user,to:userId,sdp:sdp,answer_type:answer_type};
        this.sendMessage(message);
    }

    sendAnswer(userId,sdp,answer_type) {
        const message = {type:"video_answer",from:this.user,to:userId,sdp:sdp,answer_type:answer_type};
        this.sendMessage(message);
    }

    sendIceCandidate(userId,candidate) {
        const message = {type:"new_ice_candidate",from:this.user,to:userId,candidate:candidate};
        this.sendMessage(message);
    }

    sendUserProfile() {
        const message = Backend.auth.getProfile();
        if (!message.id) return;
        message.type = "update_user_profile";
        message.from = message.id;
        this.sendMessage(message);
    }

    requestUsersList() {
        const message = {type:"request_users_list",from:this.user};
        this.sendMessage(message);
    }

    sendMessage(object) {
        this.checkConnection();
        if (this.isOnline()) {
            this.connection.send(this.createMessage(object));
        } else {
            if (!this.messageQueue.length || !_.isEqual(this.messageQueue[this.messageQueue.length-1],object)) {
                this.messageQueue.push(object);
            }
        }
    }

    sendMessageQueue() {
        if (!this.messageQueue) this.messageQueue = [];
        while (this.messageQueue.length) {
            const message = this.messageQueue.shift();
            this.sendMessage(message);
        }
    }

    createMessage(object) {
        return JSON.stringify(object);
    }

    checkConnection() {
        if (this.connection && this.connectionStatus !== this.connection.readyState) {
            this.connectionStatus = this.connection.readyState;
            if (this.isOnline()) this.sendUserProfile();
            this.triggerEvent("onSignal",[{type:"connection_status",data:{status:this.connection.readyState}}])
        }
    }

    isOnline() {
        return this.connectionStatus === 1
    }
}

export default Signalling.getInstance();