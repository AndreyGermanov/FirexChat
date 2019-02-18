import Backend from './Backend'
import Service from './Service';

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
        this.url = "wss:/portal.it-port.ru/firexchat";
        this.connect();
        Backend.auth.subscribe(this);
    }

    connect() {
        this.connection = new WebSocket(this.url);
    }

    onAuthChange(isLogin) {
        if (isLogin) {
            const username = Backend.auth.user().email;
            this.connect();
            console.log("CONNECTION CREATED");
            this.connection.onopen = () => {

            }
            this.connection.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === "video_offer") {
                    this.triggerEvent("onSignal",[{type:'offer',data:{from:message.from,to:message.to,sdp:message.sdp,type:message.answer_type}}]);
                }
                if (message.type === "video_answer") {
                    this.triggerEvent("onSignal",[{type:'answer',data:{from:message.from,to:message.to,sdp:message.sdp,type:message.answer_type}}]);
                }
                if (message.type === "new_ice_candidate") {
                    console.log("NEW ICE CANDIATE");
                    this.triggerEvent("onSignal",[{type:'iceCandidate',data:{from:message.from,to:message.to,candidate:message.candidate}}]);
                }
                if (message.type === "call") {
                    console.log("NEW CALL");
                    this.triggerEvent("onSignal",[{type:'call',data:message}]);
                }
                if (message.type === "call_response") {
                    console.log("NEW CALL RESPONSE");
                    this.triggerEvent("onSignal",[{type:'call_response',data:message}]);
                }
            }
            this.getMessagesInterval = setInterval(() => { this.connection.send(JSON.stringify({
                type: "get_messages",
                from: username
            }))},5000);
        } else {
            clearInterval(this.getMessagesInterval);
            this.connection.close();
        }
    }

    sendCallRequest(userId) {
        this.connection.send(JSON.stringify({
            type: "call",
            from: Backend.auth.user().email,
            to: userId
        }))
    }

    sendCallResponse(userId,responseType) {
        this.connection.send(JSON.stringify({
            type: "call_response",
            from: Backend.auth.user().email,
            to: userId,
            answer: responseType ? 'accept' : 'reject'
        }))
    }

    sendOffer(userId,sdp,answer_type,callback=()=>{}) {
        this.connection.send(JSON.stringify({
            type: "video_offer",
            from: Backend.auth.user().email,
            to: userId,
            sdp: sdp,
            answer_type: answer_type
        }))
        callback();
    }

    sendAnswer(userId,sdp,answer_type,callback=()=>{}) {
        this.connection.send(JSON.stringify({
            type: "video_answer",
            from: Backend.auth.user().email,
            to: userId,
            sdp: sdp,
            answer_type: answer_type
        }))
        callback();
    }


    sendIceCandidate(userId,candidate,callback=()=>{}) {
        if (candidate == null) { callback();return;}
        this.connection.send(JSON.stringify({
            type: "new_ice_candidate",
            from: Backend.auth.user().email,
            to: userId,
            candidate: candidate,
        }))
        callback();
    }

};

export default Signalling.getInstance();