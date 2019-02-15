import React, {Component} from 'react';
import {View,Text,FlatList,TouchableOpacity} from 'react-native';

export default class UsersList extends Component {

    render() {

        return (
            <FlatList style={{flex:1,width:'100%',height:'100%'}} data={this.props.users} renderItem={({item}) => this.renderItem(item)}/>
        )
    }

    renderItem(item) {
        return (
            <TouchableOpacity onPress={this.props.call(item.id)}>
                <Text>{item.id}</Text>
            </TouchableOpacity>
        )
    }

    componentDidMount() {
        this.props.loadList();
    }

}