import VideoChatComponent from '../components/VideoChat';
import {connect} from 'react-redux';

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
            stream: state.localStream
        }
    }

    mapDispatchToProps(dispatch) {
        return {

        }
    }
}