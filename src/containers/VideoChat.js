import VideoChatComponent from '../components/VideoChat';
import {connect} from 'react-redux';
import Backend from '../services/Backend'
import Store from "../store/Store";
import Sessions from '../models/Sessions'

export default class VideoChatContainer {

    /**
     * Binds properties and methods of this controller main screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;

    static getComponent() {
        if (!VideoChatContainer.component) {
            const item = new VideoChatContainer();
            VideoChatContainer.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(VideoChatComponent);
        }
        return VideoChatContainer.component;
    }

    mapStateToProps(state) {
        state = Store.getState();
        const users = Sessions.list.filter((item) => item.id === Backend.videoChat.peerUser);
        let username = null;
        let user = null;
        if (users && users.length) {
            user = users[0];
            username = user.name;
        }
        return {
            stream: Backend.videoChat.localStream ? Backend.videoChat.localStream.toURL() : null,
            remoteStream: Backend.videoChat.remoteStream ? Backend.videoChat.remoteStream.toURL() : null,
            mode: state.chat.mode,
            user: user,
            username: username
        }
    }

    mapDispatchToProps() {
        return {
            hangup: () => this.hangup()
        }
    }

    hangup() {
        Backend.videoChat.hangup();
    }
}