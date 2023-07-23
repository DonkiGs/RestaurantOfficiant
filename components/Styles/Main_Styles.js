import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f1e0c4",
    },
    squareContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: "row",
        marginBottom: 16,
    },
    square: {
        width: 80,
        height: 80,
        marginHorizontal: 8,
        backgroundColor: "#c22d2d",
        justifyContent: "center",
        alignItems: "center",
    },
    updatedSquare: {
        backgroundColor: "green",
    },
    occupiedSquare: {
        backgroundColor: "purple",
    },
    otherOccupiedSquare: {
        backgroundColor: "#800080",
    },
    profileIconContainer: {
        marginRight: 8,
    },
    SquareText: {
        fontSize: 16,
        color: "#d9a98b",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        marginTop: 8,
    },
    middleContainer: {
        padding: 16,
        backgroundColor: "#f1e0c4",
        flex: 1
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: "#f1e0c4",
        padding: 20,
        borderRadius: 8,
        borderColor: "#000000",
        borderWidth: 1,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        marginBottom: 5,
        fontSize: 16,
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    selectedDateText: {
        textAlign: 'center',
        marginTop: 10,
        fontWeight: 'bold',
    },
    buttonModal: {
        borderRadius: 10,
        backgroundColor: '#ee3737',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonDate: {
        marginHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#d9a98b',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
});

export default styles;