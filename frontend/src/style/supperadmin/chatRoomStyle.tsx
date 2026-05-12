import { StyleSheet } from "react-native";




const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
    },
    arrowAndNameContainer: {
        flexDirection: "row", alignItems: "center", padding: 10,
    },
    avatarName: {
        flexDirection: "row",
        alignItems: "center",
        width: "90%"
    },
    name: { 
        fontSize: 18, fontWeight: "700", marginLeft: 10
    },
    bgImage: {
       
    },
    inputContainer: { 
        flexDirection: "row", padding: 10, alignItems: "center",
    },
    inputText: { 
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,         
    },


    //Message Bubble
    time: {
        flexDirection: "row",
        textAlign: "right",
        marginTop: 10,
        fontSize: 10,
    },
    bubble: {
        
    },
    myMsg: {

    },
    otherMsg: {

    },
    image: {
        
    }
})


export default styles;