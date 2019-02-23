import {StyleSheet} from "react-native";

/**
 * Styles used for Video Chat Component design
 */
export default StyleSheet.create({
    callScreen: {
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'space-between',
        paddingTop:20,
        paddingBottom:20
    },
    callScreenText: {
        fontWeight:'900',
        fontSize:40,
        color:"yellow",
        textAlign:"center"
    },
    remoteVideo: {
        flex:1,
        flexDirection:'row',
        backgroundColor:"#335baa"
    },
    overlayScreen: {
        padding:10,
        position:'absolute',
        flex:1,
        width:'100%',
        height:'100%',
        zIndex:500,
        flexDirection:'column'
    },
    overlayScreenHeader: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    usernameText: {
        fontSize:20,
        color:"white",
        textAlign:"center"
    },
    localVideoFrame: {
        width:102,
        height:102,
        zIndex:600,
        borderWidth:1,
        borderColor:'white'
    },
    localVideo: {
        width:100,
        height:100,
        zIndex:600
    },
    hangupButton: {
        flexDirection:'row',
        justifyContent:'center'
    }
});