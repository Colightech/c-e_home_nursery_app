import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container : {
        padding: 15, 
    },
    backButton: {
        backgroundColor: "#aaa",
        width: 30,
        height: 30,
        padding: 1,
        borderRadius: 50,
    },
    pickerStyle: {
        fontSize: 18,
    },
    userInputStyle : {
        borderWidth: 0.2, 
        backgroundColor: "#ddd", 
        marginVertical: 3, 
        borderRadius: 10, 
        padding: 10, 
        fontWeight: 600, 
        fontSize: 15,
    },
    buttonStyle: {
        marginVertical: 20,
    },
    switchies: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 20, 
        alignItems: "center"
    }
})

export default styles;