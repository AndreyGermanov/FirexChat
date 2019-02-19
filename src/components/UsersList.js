import React, {Component} from 'react';
import {View,Text,FlatList,TouchableOpacity} from 'react-native';
import t from '../utils/translate';

export default class UsersList extends Component {

    render() {
        return (
            <FlatList style={{flex:1,width:'100%',height:'100%'}} data={this.props.users} renderItem={({item}) => this.renderItem(item)}/>
        )
    }

    renderItem(item) {
        return (
            <View key={"user_"+item.id} style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                <Text>{item.id}</Text>
                {this.renderItemButtons(item)}
            </View>
        )
    }

    renderItemButtons(item) {
        if (!this.props.incomingCalls[item.id]) {
            return (
                <TouchableOpacity onPress={() => this.props.call(item.id)}>
                    <Text>
                        {t("Call")}
                    </Text>
                </TouchableOpacity>
            )
        } else {
             return(
            <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                <TouchableOpacity onPress={() => this.props.answer(item.id)}>
                    <Text>
                        {t("Answer")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.reject(item.id)}>
                    <Text>
                        {t("Reject")}
                    </Text>
                </TouchableOpacity>
            </View>)
        }
    }

    componentDidMount() {
        this.props.loadList();
    }

}