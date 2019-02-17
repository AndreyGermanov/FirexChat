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
        Backend.auth.subscribe(this);
    }

    onAuthChange(isLogin) {
        if (isLogin) {

            Backend.db.subscribe(this,'offers');//,['to','==',Backend.auth.user().email]);
            /*
            Backend.db.subscribe(this,'answers',['to','==',Backend.auth.user().email]);
            Backend.db.subscribe(this,'iceCandidates',['to','==',Backend.auth.user().email]);
            */
        } else {
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
                console.log("RECEIVED OFFER SIGNAL");
                this.triggerEvent("onSignal",[{type:'offer',data:data}]);
                break;
            case "answers":
                this.triggerEvent("onSignal",[{type:'answer',data:data}]);
                break;
            case "iceCandidates":
                this.triggerEvent("onSignal",[{type:'iceCandidate',data:data}])
        }
        Backend.db.deleteItem(collection,change.data.id,()=>{});
    }

    sendOffer(userId,sdp,type,callback) {
        Backend.db.putItem('offers',null,{from: Backend.auth.user().email,to:userId,sdp:sdp,type:type},callback);
    }

    sendAnswer(userId,sdp,type,callback) {
        Backend.db.putItem('answers',null,{from: Backend.auth.user().email,to:userId,sdp:sdp,type:type},callback);
    }


    sendIceCandidate(userId,candidate,callback) {
        Backend.db.putItem('iceCandidates',null,{from: Backend.auth.user().email,to:userId,candidate:candidate},callback);
    }

};

export default Signalling.getInstance();