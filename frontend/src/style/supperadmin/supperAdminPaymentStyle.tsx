import { StyleSheet } from "react-native";



const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 15
    },
    titleIcon: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    titleText: {
        fontSize: 18,
        fontWeight: "600",
    },
    inputContainer: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        position: "absolute",
        top: 50,
        left: 2,
        right: 2,
        bottom: 2, 
        zIndex: 20,      
    },
    createClose: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    inputTitleText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    childPicker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 15,
        overflow: "hidden",
    },
    inputStyle: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        marginTop: 15,
    },
    inputBtn: {
        backgroundColor: "#2196F3",
        padding: 15,
        borderRadius: 12,
        marginTop: 20,
    },
    inputText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    loadingStyle: {
        textAlign: "center",
        marginTop: 280,
        fontSize: 35,
    },
})

export default styles;