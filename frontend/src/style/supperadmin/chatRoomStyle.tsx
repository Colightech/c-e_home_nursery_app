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


    // OPEN ATTACHMENT TRAY
    openAttachmentContainer: {
        position: "absolute",
        bottom: 70,
        left: 10,
        right: 10,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        elevation: 10,  
        overflow: "hidden",       
    },
    attachmentFlex : {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    attachItems: { 
        alignItems: "center", margin: 10,
    },
    galleryIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#d8b4fe",
        justifyContent: "center",
        alignItems: "center",
    },
    text: { 
        marginTop: 5,
    },
    cameraIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#7dd3fc",
        justifyContent: "center",
        alignItems: "center",
    },
    documentIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#86efac",
        justifyContent: "center",
        alignItems: "center",
    },





    //Message Bubble
    time: {
        flexDirection: "row",
        textAlign: "right",
       
        fontSize: 12,
        fontWeight: "600",
        color: "grey"
    },
    bubble: {
        
    },
    myMsg: {

    },
    otherMsg: {

    },
    image: {
        width: 220,
        height: 220,
        borderRadius: 10,
        marginTop: 5,
    },
    video: {
        width: 250,
        height: 300,
        borderRadius: 10,
    },
})


export default styles;