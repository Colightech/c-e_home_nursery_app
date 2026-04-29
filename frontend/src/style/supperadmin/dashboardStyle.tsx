
import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container : {
        flex: 1,  marginTop: 10, padding: 20,
    },
    appNameContainer : {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between",
    },
    nameTitle : {
        fontSize: 16, fontWeight: "bold", marginBottom: 10,
    },
    addAndSettings : {
        display: "flex", flexDirection: "row", gap: 20,
    },
    
    addUser : {
        width: 25, 
        height: 25,
        borderWidth: 1,
        borderRadius: 5,
    },
    dashboardBox: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
        backgroundColor: "white",
        elevation: 5,
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20
    },
    startCardContainer : { 
        flexDirection: "row", 
        flexWrap: "wrap", 
        justifyContent: "space-between"
    },
    startCard : {
        width: "48%",
        marginBottom: 10,
    },
    bottomNavContainer : {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        elevation: 10,
        backgroundColor: "white",
        paddingVertical: 10,
    },
    bottomNavItem : {
        padding: 5, 
        paddingBottom: 10
    },
    icon : {
        alignSelf: "center",
        marginBottom: 3
    }
})
export default styles;