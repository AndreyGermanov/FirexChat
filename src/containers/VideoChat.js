import VideoChatComponent from '../components/VideoChat';
import {connect} from 'react-redux';
import Backend from '../services/Backend'
import Store from "../store/Store";

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
        return {
            stream: Backend.videoChat.localStream,
            remoteStream: Backend.videoChat.remoteStream,
            mode: state.chat.mode
        }
    }

    mapDispatchToProps(dispatch) {
        return {
            hangup: () => this.hangup()
        }
    }

    hangup() {
        Backend.videoChat.hangup();
    }
}