import {StyleSheet} from "react-native";
export default StyleSheet.create({
    container: {backgroundColor:'white'},
    itemRowContainer: {
        flex:1,
        height:75,
        borderBottomWidth:1,
        borderBottomColor:"#f4f4f8"
    },
    itemContainer: {
        padding:15,
        flexDirection:'row',
        flex:1,
        justifyContent:'space-between'
    },
    itemInfoContainer: {
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    itemImage: {
        width:45,
        height:45,
        borderRadius:100,
        borderWidth:1,
        borderColor:"#d9935f"
    },
    itemTextContainer: {
        flexDirection:'column',
        paddingLeft:15
    },
    itemName: {
        color:"#000000",
        fontWeight:'bold',
        fontSize:10
    },
    itemEmail: {
        color:"#b1b6cd",
        fontWeight:'bold',
        fontSize:9
    },
    itemButtonContainer: {paddingRight:5},
    itemButton: {width:32,height:32}
});