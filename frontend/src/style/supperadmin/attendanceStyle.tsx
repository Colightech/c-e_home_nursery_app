import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
    padding: 10,
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
    btnText: {
        color: "#fff",
        fontWeight: 600
    }
})


export default styles;