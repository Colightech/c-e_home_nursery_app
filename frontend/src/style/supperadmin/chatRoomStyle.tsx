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
    previewContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "black",
        zIndex: 9999,       
    },
    closePreview: {
        position: "absolute",
        top: 10,
        right: 30,
        zIndex: 10000, 
        backgroundColor: "black",
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    closePreviewBtn: { 
        color: "white", fontSize: 18,
        textAlign: "center",
        marginTop: 7,
    },
    nameAndRealTimeContainer: {        
    },
    onlineOfflineContainer: {
        marginLeft: 10
    },
    online: {
        color: "#78db07",
        fontWeight: "500",
    },
    offline: {
        color: "#898a87",
        fontWeight: "500",
    },
    download: {
        position: "absolute",
        bottom: 10,
        left: 20,
        zIndex: 999,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,          
    },
    downloadText: {
        color: "white",
        fontWeight: "bold",          
    },





    //Message Bubble
    bubble: {
        
    },
    myMsg: {

    },
    otherMsg: {

    },
    progress: {
        fontSize: 15,
        opacity: 0.6,
        textAlign: "center",
        fontWeight: "600",
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
    retry: { 
        color: "#fff", 
        fontSize: 18,
        fontWeight: "600",
        backgroundColor: "black",
        opacity: 0.7,
        position: "absolute",
        top: -130,
        right: 70,
        padding: 10,
        width: 80,
        textAlign: "center",
        zIndex: 50,
        borderRadius: 10,
    },
    timeAndStatus: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        justifyContent: "flex-end"
    },
    time: {
        flexDirection: "row",
        textAlign: "right",
        fontSize: 12,
        fontWeight: "600",
        color: "grey"
    },
})


export default styles;