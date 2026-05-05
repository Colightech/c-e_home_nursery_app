import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        padding: 20,
        position: "relative",
    },
    backIcon: {
        backgroundColor: "#aaa",
        width: 30,
        padding: 2,
        borderRadius: 50,
        marginBottom: 10,
    },
    title: {
        fontWeight: "bold",
        color: "#6d6b6b"
    },
    liveTime: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6d6b6b",
        marginBottom: 10,
    },
  
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 2,
    },
    left: {
        alignItems: "center",
    },
    middle: {
        flex: 1,
        paddingHorizontal: 10,
    },
    right: {
        justifyContent: "center",
    },
    checkInBtn: {
        backgroundColor: "green",
        padding: 8,
        borderRadius: 5,
        
    },
    checkOutBtn: {
        backgroundColor: "red",
        padding: 8,
        borderRadius: 5,
    },
    checkText: {
        color: "#fff",
        fontWeight: 600
    },

    // MODAL
    modalOverlay: {
        backgroundColor: "#fff",
        elevation: 10,
        padding: 20,
        borderRadius: 20,
        position: "absolute",
        right: 20,
        left: 20,
        top: 150
    },
    modalBox: {
       
    },
    cancelNcheck: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    modalTitle: {

    },
    input: {
        borderWidth: 0.2, 
        backgroundColor: "#ddd", 
        marginVertical: 5, 
        borderRadius: 10, 
        padding: 15, 
        fontWeight: 600, 
    },
    confirmBtn: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 10,
        marginTop: 10
    },
    confirmBtnText: {
        color: "#fff",
        textAlign: "center"
    },



    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

    statusText: {
        fontSize: 14,
        fontWeight: "600",
    },

    timeText: {
        fontSize: 12,
        color: "#555",
    },

    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginBottom: 5,
    },

    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
})


export default styles;