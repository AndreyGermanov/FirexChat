import {StyleSheet} from "react-native";

/**
 * Styles used for Login Component design
 */
export default  StyleSheet.create({
    scrollView: {
        height:"100%",
        flexDirection:'column',
        paddingLeft:15,
        paddingRight:15,
        paddingTop:10,
        backgroundColor:"white"
    },
    logoContainer: {
        flexDirection:'row',
        justifyContent:'center',
        marginBottom:10
    },
    formContainer: {
        borderWidth:2,
        borderColor:"#d9935f",
        padding:15,
        borderRadius:10,
        backgroundColor:"white"
    },
    error: { color:'red' },
    fieldLabelText: {
        color:"#d9935f",
        fontWeight:'bold'
    },
    inputField: {
        borderWidth:1,
        borderRadius:5,
        borderColor:"#d9935f",
        padding:0,
        paddingLeft:10,
        paddingRight:10,
        marginTop:10,
        marginBottom:10
    },
    button: {
        flexDirection:'row',
        padding:5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"#d9935f"
    },
    buttonText: {color:'white'},
    link: {
        flexDirection:'row',
        justifyContent:'center',
        paddingTop:10
    },
    linkText: {
        color:"#990000",
        fontWeight:'bold'
    }
});