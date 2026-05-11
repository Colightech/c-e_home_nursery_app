import { StyleSheet } from "react-native";



const styles = StyleSheet.create({
    container : { 
        flex: 1,
        margin: 15,
    },
    backText: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "600"
    },
    chats: {
        marginTop: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
             
    },
    searchInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ddd",
        borderColor: "#aaa",
        borderWidth: 1,
        marginTop: 20,
        borderRadius: 10,
        paddingLeft: 5,
    },
    searchInput: {
        paddingHorizontal: 10,
        height: 45,
    },
    chatsItem : { 
        padding: 15, borderBottomWidth: 0.5, borderColor: "#ddd", 
        width: "100%"
    },
    chatsItemContainer : {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 20,
    },
    name : { 
        fontSize: 16, fontWeight: "600",
    }
})


export default styles;