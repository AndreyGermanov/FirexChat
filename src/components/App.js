import React, {Component} from 'react';
import VideoChatContainer from '../containers/VideoChat'
import LoginContainer from "../containers/Login";
import RegisterContainer from '../containers/Register';
import UsersListContainer from '../containers/UsersList';
import Loading from '../components/Loading'
import ProfileContainer from '../containers/Profile';
import HeaderContainer from '../containers/Header';
import {Screens} from "../reducers/RootReducer";
import {View} from 'react-native';

export default class App extends Component {

    render() {
        return this.renderScreen();
    }

    renderScreen() {

        const Login = LoginContainer.getComponent();
        const Register = RegisterContainer.getComponent();
        const UsersList = UsersListContainer.getComponent();
        const VideoChat = VideoChatContainer.getComponent();
        const Profile = ProfileContainer.getComponent();


        let screen = <Loading/>;

        switch(this.props.activeScreen) {
            case Screens.LOADING: { screen = <Loading/>; break; }
            case Screens.LOGIN: { screen = <Login/>; break; }
            case Screens.REGISTER: { screen = <Register/>; break; }
            case Screens.PROFILE: { screen = this.wrapScreen(<Profile/>); break; }
            case Screens.USERS_LIST: { screen = this.wrapScreen(<UsersList/>); break; }
            case Screens.VIDEO_CHAT: { screen = <VideoChat/>; break; }
        }

        return screen;
    }

    wrapScreen(component) {
        const Header = HeaderContainer.getComponent();
        return (
            <View style={{flex:1,flexDirection:'column'}}>
                <Header/>
                {component}
            </View>
        )
    }

    componentDidMount() {
        this.props.start();
    }
}

