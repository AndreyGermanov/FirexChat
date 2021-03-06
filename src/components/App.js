import React, {Component} from 'react';
import VideoChatContainer from '../containers/VideoChat'
import LoginContainer from "../containers/Login";
import RegisterContainer from '../containers/Register';
import UsersListContainer from '../containers/UsersList';
import Loading from '../components/Loading'
import ProfileContainer from '../containers/Profile';
import HeaderContainer from '../containers/Header';
import ImagePickerContainer from '../containers/ImagePicker';
import {Screens} from "../reducers/RootReducer";
import {View} from 'react-native';
import Styles from '../styles/App';

/**
 * Main application component, which used to switch screens based on current application state
 */
export default class App extends Component {

    /**
     * Method renders component on the screen
     * @returns Rendered component
     */
    render() {
        const Login = LoginContainer.getComponent();
        const Register = RegisterContainer.getComponent();
        const UsersList = UsersListContainer.getComponent();
        const VideoChat = VideoChatContainer.getComponent();
        const Profile = ProfileContainer.getComponent();
        const ImagePicker = ImagePickerContainer.getComponent();
        let screen = <Loading/>;

        switch(this.props.activeScreen) {
            case Screens.LOADING: { screen = <Loading/>; break; }
            case Screens.LOGIN: { screen = <Login/>; break; }
            case Screens.REGISTER: { screen = <Register/>; break; }
            case Screens.PROFILE: { screen = this.wrapScreen(<Profile/>); break; }
            case Screens.USERS_LIST: { screen = this.wrapScreen(<UsersList/>); break; }
            case Screens.VIDEO_CHAT: { screen = <VideoChat/>; break; }
            case Screens.IMAGE_PICKER: { screen = <ImagePicker/>; break; }
        }
        return screen;
    }

    /**
     * Method used to render specified component inside container with header
     * @param component - Input component to inject under the header
     * @returns Rendered component
     */
    wrapScreen(component) {
        const Header = HeaderContainer.getComponent();
        return (
            <View style={Styles.mainScreen}>
                <Header/>
                {component}
            </View>
        )
    }

    /**
     * Method runs after component appears on the screen. It begins application start sequence
     */
    componentDidMount() {
        this.props.start();
    }
}

