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
        this.connection = new WebSocket("wss:/portal.it-port.ru/turn");
        Backend.auth.subscribe(this);
    }

    onAuthChange(isLogin) {
        if (isLogin) {
            const username = Backend.auth.user().email;
            this.connection = new WebSocket("wss:/portal.it-port.ru/turn");
            console.log("CONNECTION CREATED");
            this.connection.onopen = () => {

            }
            this.connection.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log(message);
                if (message.type === "video_offer") {
                    this.triggerEvent("onSignal",[{type:'offer',data:{from:message.username,to:username,sdp:message.sdp,type:message.answer_type}}]);
                }
                if (message.type === "video_answer") {
                    this.triggerEvent("onSignal",[{type:'answer',data:{from:message.username,to:username,sdp:message.sdp,type:message.answer_type}}]);
                }
                if (message.type === "new_ice_candidate") {
                    console.log("NEW ICE CANDIATE");
                    this.triggerEvent("onSignal",[{type:'iceCandidate',data:{from:message.username,to:username,candidate:message.candidate}}]);
                }
            }
            this.requestOffersInterval = setInterval(() => { this.connection.send(JSON.stringify({
                type: "request_offers",
                username: username
            }))},5000);
            this.requestAnswersInterval = setInterval(() => { this.connection.send(JSON.stringify({
                type: "request_answers",
                username: username
            }))},5000);
            this.requestCandidatesInterval = setInterval(() => { this.connection.send(JSON.stringify({
                type: "request_candidates",
                username:username
            }))
            },5000)
        } else {
            clearInterval(this.requestOffersInterval);
            clearInterval(this.requestAnswersInterval);
            clearInterval(this.requestCandidatesInterval);
            this.connection.close();
        }
    }

    sendOffer(userId,sdp,answer_type,callback=()=>{}) {
        this.connection.send(JSON.stringify({
            type: "video_offer",
            username: Backend.auth.user().email,
            target_user: userId,
            sdp: sdp,
            answer_type: answer_type
        }))
        callback();
    }

    sendAnswer(userId,sdp,answer_type,callback=()=>{}) {
        this.connection.send(JSON.stringify({
            type: "video_answer",
            username: Backend.auth.user().email,
            target_user: userId,
            sdp: sdp,
            answer_type: answer_type
        }))
        callback();
    }


    sendIceCandidate(userId,candidate,callback=()=>{}) {
        if (candidate == null) { callback();return;}
        this.connection.send(JSON.stringify({
            type: "new_ice_candidate",
            username: Backend.auth.user().email,
            target_user: userId,
            candidate: candidate,
        }))
        callback();
    }

};

export default Signalling.getInstance();