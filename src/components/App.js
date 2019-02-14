import React, {Component} from 'react';
import VideoChatContainer from '../containers/VideoChat'

export default class App extends Component {

    render() {
        const VideoChat = VideoChatContainer.getComponent();
        return <VideoChat/>
    }
}

