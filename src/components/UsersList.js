import React, {Component} from 'react';
import {View,Text,FlatList,TouchableOpacity,Image} from 'react-native';
import Styles from '../styles/UsersList'

export default class UsersList extends Component {

    render() {
        return (
            <FlatList data={this.props.users} contentContainerStyle={{backgroundColor:'white'}} renderItem={({item}) => this.renderItem(item)}/>
        )
    }

    renderItem(item) {
        // noinspection JSUnresolvedFunction
        const image = item.image ? item.image :  require("../img/default_profile.png");
        return (
            <View style={Styles.itemRowContainer}>
                    <View style={Styles.itemContainer}>
                        <View style={Styles.itemInfoContainer}>
                            <Image source={image} style={Styles.itemImage}/>
                            <View style={Styles.itemTextContainer}>
                                <Text style={Styles.itemName}>{item.name}</Text>
                                <Text style={Styles.itemEmail}>{item.id}</Text>
                            </View>
                        </View>
                        {this.renderItemButtons(item)}
                    </View>
            </View>
        )
    }

    renderItemButtons(item) {
        let opacity = {opacity:1};
        if (!this.props.isOnline) opacity = {opacity:0.2};
        if (!this.props.incomingCalls[item.id]) {
            // noinspection JSUnresolvedFunction
            return (
                <TouchableOpacity onPress={() => this.props.call(item.id)}>
                    <Image source={require("../img/phone-icon-32x32.png")} style={[Styles.itemButton,opacity]}/>
                </TouchableOpacity>
            )
        } else {
            // noinspection JSUnresolvedFunction
             return(
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <TouchableOpacity onPress={() => this.props.answer(item.id)} style={Styles.itemButtonContainer}>
                    <Image source={require("../img/phone-ring-32x32.png")} style={[Styles.itemButton,opacity]}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.reject(item.id)}>
                    <Image source={require("../img/phone-call-reject-icon-32x32.png")} style={[Styles.itemButton,opacity]}/>
                </TouchableOpacity>
            </View>)
        }
    }

    componentDidMount() {
       // this.props.loadList();
    }

}