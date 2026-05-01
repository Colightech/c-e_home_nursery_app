import { StyleSheet } from "react-native";



const styles = StyleSheet.create({
    container: {
        padding: 10,
        position: "relative"
    },
    textTitle: {
        fontSize: 25,
        fontWeight: 600,
        textAlign: "center"
    },
    mapItemsContainer : {
        padding: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
        alignItems: "center",
        justifyContent: "space-around"

    },
    mapItems : {
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        backgroundColor: "#fff",
        elevation: 5,
        marginTop: 10,
        width: 150,
        padding: 10,
        borderRadius: 20,
    },
    nameContainer : {
        flexDirection: "row",
        gap: 10,
    },
    openDetaile: {
        position: "absolute",
        right: 30,
        left: 30,
        top: 80,
        bottom: 50
    }
})

export default styles;