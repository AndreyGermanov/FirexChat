import Backend from './Backend'
import Service from './Service';
import WebSocketConfig from '../config/websocket';

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

    init() {
        this.user = null;
        this.getMessagesInterval = null;
        this.connect();
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

        this.connection.onclose = () => {
            if (this.getMessagesInterval !== null) {
                clearInterval(this.getMessagesInterval);
                this.getMessagesInterval = null;
            }
            this.connect();
        };
    }

    onAuthChange(isLogin) {
        if (isLogin) {
            this.user = Backend.auth.user().email;
            this.connect();
        } else {
            clearInterval(this.getMessagesInterval);
            this.getMessagesInterval = null;
            this.connection.close();
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

    sendMessage(object) {
        this.connection.send(this.createMessage(object));
    }

    createMessage(object) {
        return JSON.stringify(object);
    }
}

export default Signalling.getInstance();