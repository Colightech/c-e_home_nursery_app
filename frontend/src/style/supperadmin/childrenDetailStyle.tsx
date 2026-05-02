import { StyleSheet } from "react-native";



const styles = StyleSheet.create({
    container : {
        backgroundColor: "#fff",
        elevation: 20,
        padding: 20,
        borderRadius: 20,
    },
    closeButton: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    iconAndName: {
        flexDirection: "column",
        alignItems: "center"
    },
    names: {
        flexDirection: "row",
        gap: 10
    },
    basicDetails: {
        marginTop: 20,
        borderTopWidth: 0.5
    },
    basicDetailsItems: {
        fontWeight: 600,
    },
    parentDetails: {
        marginTop: 10,
        textAlign: "center",
        fontSize: 15,
        fontWeight: 600
    }
})

export default styles;