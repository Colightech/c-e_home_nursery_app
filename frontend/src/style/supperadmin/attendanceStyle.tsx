import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        padding: 10,
        position: "relative",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#eee",
        marginBottom: 10,
        borderRadius: 10,
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
    }
})


export default styles;