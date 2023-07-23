import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#f1e0c4",
    },
    inputContainer: {
        width: "65%",
        marginBottom: 10,
        backgroundColor: "#f1e0c4",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#c22d2d",
        padding: 5,
        marginBottom: 2,
        backgroundColor: "#f1e0c4",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#c22d2d",
        marginBottom: 5,
        backgroundColor: "#f1e0c4",
    },
    passwordInput: {
        flex: 1,
        padding: 5,
    },
    showPasswordButton: {
        padding: 10,
    },
    button: {
        width: 140,
        marginVertical: 5,
        paddingVertical: 12,
        borderRadius: 40,
        backgroundColor: "#c22d2d",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    logo: {
        width: 200,
        height: 150,
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        marginLeft: 5,
    },
});

export default styles;