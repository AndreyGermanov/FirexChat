import Header from "./Header";
let Styles = Header;
Styles.buttonBar = {
    flexDirection:"row",
    width:'100%',
    height:50,
    padding:20,
    alignItems:'center',
    justifyContent:'center'
};
Styles.button = {
    backgroundColor:"#d9935f",
    flex:1,
    padding:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    margin:5
};
Styles.buttonText = {color:'white'};
export default Styles;