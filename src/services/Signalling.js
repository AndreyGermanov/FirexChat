import Backend from './Backend'
import Service from './Service';
import WebSocketConfig from '../config/websocket';
import _ from 'lodash';

/**
 * Service which communicates with messaging server.
 * Used as a client for WebRTC signalling server. Used by VideoChat module exchange
 * WebRTC related information: offers, answers, ICE candidates and also to initiate and reject video calls
 * Also used to exchange information about user sessions: provides list of users, propagates changes in user sessions
 * to peers
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

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.user = null;
        this.messageQueue = [];
        this.getMessagesInterval = null;
        this.tryConnectInterval = null;
        this.connectionStatus = null;
    }

    /**
     * Initialization method
     */
    init() {
        Backend.auth.subscribe(this);
    }

    /**
     * Method used to connect to WebSocket server and set message listeners
     */
    connect() {
        console.log("CONNECTING");
        this.connection = new WebSocket(WebSocketConfig.url);
        this.connection.onopen = () => {
            console.log("CONNECTED");
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

    /**
     * Subscription method which runs when authentication status of user changes
     * @param isLogin - True if user Signs In, False if user Signs Out
     */
    onAuthChange(isLogin) {
        if (isLogin) {
            this.user = Backend.auth.user().email;
            if (!this.tryConnectInterval) {
                this.tryConnectInterval = setInterval(() => {
                    if (!this.connection || this.connection.readyState !== this.connection.OPEN) {
                        console.log("TRYING TO CONNECT");
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

    /**
     * Method sends call request to specified user
     * @param userId - ID of user to call
     */
    sendCallRequest(userId) {
        const message = {type:'call',from:this.user,to:userId};
        this.sendMessage(message);
    }

    /**
     * Method sends response to call request of specified user
     * @param userId - ID of user to respond to
     * @param responseType - Type of response: 'accept' or 'reject'
     */
    sendCallResponse(userId,responseType) {
        const message = {type:'call_response',from:this.user,to:userId,answer:responseType ? 'accept' : 'reject'};
        this.sendMessage(message);
    }

    /**
     * Method used to send WebRTC offer to specified user
     * @param userId - ID of user to send offer to
     * @param sdp - Offer description according to SDP format
     * @param answer_type - Type of offer - 'accept' or 'reject'
     */
    sendOffer(userId,sdp,answer_type) {
        const message = {type:'video_offer',from:this.user,to:userId,sdp:sdp,answer_type:answer_type};
        this.sendMessage(message);
    }

    /**
     * Method used to send WebRTC answer to specified user
     * @param userId - ID of user to send answer to
     * @param sdp - Answer description according to SDP format
     * @param answer_type - Type of answer - 'accept' or 'reject'
     */
    sendAnswer(userId,sdp,answer_type) {
        const message = {type:"video_answer",from:this.user,to:userId,sdp:sdp,answer_type:answer_type};
        this.sendMessage(message);
    }

    /**
     * Method used to send WebRTC ICE candidate to specified user
     * @param userId - ID of user to send to
     * @param candidate - information about candidate as SDP
     */
    sendIceCandidate(userId,candidate) {
        const message = {type:"new_ice_candidate",from:this.user,to:userId,candidate:candidate};
        this.sendMessage(message);
    }

    /**
     * Method used to send current user profile information to websocket server. Used to notify
     * other users about profile updates
     */
    sendUserProfile() {
        const message = Backend.auth.getProfile();
        if (!message.id) return;
        message.type = "update_user_profile";
        message.from = message.id;
        this.sendMessage(message);
    }

    /**
     * Method sends request to get current active user sessions list from server
     */
    requestUsersList() {
        const message = {type:"request_users_list",from:this.user};
        this.sendMessage(message);
    }

    /**
     * Internal method used to format and send message to the websocket server if it's online
     * or put it to queue if it's offline
     * @param object - Object to send as a message
     */
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

    /**
     * Method used to send all websocket messages from queue to websocket server
     */
    sendMessageQueue() {
        if (!this.messageQueue) this.messageQueue = [];
        while (this.messageQueue.length) {
            const message = this.messageQueue.shift();
            this.sendMessage(message);
        }
    }

    /**
     * Method used to construct websocket message from specified object
     * @param object - Input object
     * @returns - Message as string
     */
    createMessage(object) {
        return JSON.stringify(object);
    }

    /**
     * Method used to check current server connection status and notify all subscribers if connection status changes
     */
    checkConnection() {
        if (this.connection && this.connectionStatus !== this.connection.readyState) {
            this.connectionStatus = this.connection.readyState;
            if (this.isOnline()) this.sendUserProfile();
            this.triggerEvent("onSignal",[{type:"connection_status",data:{status:this.connection.readyState}}])
        }
    }

    /**
     * Used to get current connection status
     * @returns True if connected and false otherwise
     */
    isOnline() {
        return this.connectionStatus === 1
    }
}

export default Signalling.getInstance();