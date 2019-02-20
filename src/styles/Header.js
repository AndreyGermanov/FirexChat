import {StyleSheet} from "react-native";

export default StyleSheet.create({
    header: {
        flexDirection:"row",
        backgroundColor:"#f5ad77",
        height:60,
        alignItems:'center',
        justifyContent:'center'
    },
    menu: {
        flexDirection:"row",
        borderRadius:10,
        justifyContent:'space-evenly',
        width:278,
        height:25,
        borderWidth:2,
        borderColor:"#d9935f",
        backgroundColor:"#d9935f"
    },
    menuItemLeft: {
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    menuItemRight: {
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    menuItemText: {
        color:"#f5ad77",
        fontWeight:"900"
    }
});