import VideoChatComponent from '../components/VideoChat';
import {connect} from 'react-redux';
import VideoChat from '../services/VideoChat'

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
        return {
            stream: state.chat.localStream,
            remoteStream: state.chat.remoteStream,
            mode: state.chat.mode
        }
    }

    mapDispatchToProps(dispatch) {
        return {
            openLocalCamera: () => this.openLocalCamera(),
            hangup: () => this.hangup()
        }
    }

    openLocalCamera() {
        VideoChat.openLocalCamera();
    }

    hangup() {
        VideoChat.hangup();
    }
}