import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#ffcbab",
        height: 56,
        width: "100%",
        paddingHorizontal: 16,
        elevation: 4,
    },
    button: {
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        fontSize: 16,
    },
    floatingButton: {
        position: "absolute",
        bottom: 28,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#c22d2d",
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
        alignSelf: "center",
    }
});

export default styles;