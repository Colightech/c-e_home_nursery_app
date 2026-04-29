
import { StyleSheet  } from 'react-native';


const styles = StyleSheet.create({
        checkinSesiion : {
            fontSize: 30,
            marginTop: 350,
            marginLeft: 140,
        },
        container : {
            padding: 40,
            flex: 1,
        },
        appLogo : {
            marginLeft: -30,
            marginBottom: 200,
            width: 400,
            height: 50
        },
        inputContainer : {
            backgroundColor: "white",
            padding: 30,
            borderRadius: 10,
            opacity: 0.9
        },
        emailText : {
           fontSize: 18, 
        },
        emailInput : {
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
        },
        passwordText : {
            fontSize: 18, 
        },
        passwordInput : {
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            marginBottom: 20,
        },
        passwordContainer : {
            position: "relative",
            marginTop: 20
        },
        showPass : {
            position: "absolute",
            right: 10,
            top: 30
        },
    })


export default styles;

