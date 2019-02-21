import {StyleSheet} from "react-native";
export default StyleSheet.create({
    container: {
        "flex":1,
        flexDirection:"column",
        paddingTop:15,
        paddingLeft:15,
        paddingRight:15
    },
    profileImageContainer: {
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    profileImage: {
        width:132,
        height:132,
        borderRadius:100
    },
    profileNameText: {
        paddingTop:15,
        color:"#333333",
        fontWeight:'900'
    },
    formHeader: {paddingTop:15},
    formHeaderText: {
        color:"#d9935f",
        fontWeight:'900'
    },
    profileNameContainer: {
        paddingTop:15,
        flexDirection:'row',
        width:'100%',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    formFieldContainer: {
        flex:1,
        marginLeft:15,
        backgroundColor:"#dddddd"
    },
    fieldIcon: {width:20},
    inputField: {
        padding:0,
        marginRight:15,
        textAlign:'left',
        paddingLeft:5,
        width:"100%",
    },
    profileEmailContainer: {
        paddingTop:10,
        flexDirection:'row',
        width:'100%',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    button: {
        backgroundColor:"#d9935f",
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        height:40,
        marginTop:10
    },
    buttonText: {
        color:"white",
        fontWeight:'900'
    },
    error: { color:'red' }
});