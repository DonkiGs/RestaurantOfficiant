import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../Styles/TopBar_Styles";
import Menu from "../Elements/Menu"
import History from "../Elements/History";

const TopBar = ({ showMenu, setShowMenu, onStolPress, onMenuPress, onHistoryPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={onMenuPress}>
                    <View style={styles.button}>
                        <Icon name="fire" size={24} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Составить заказ</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={onHistoryPress}>
                    <View style={styles.button}>
                        <Icon name="history" size={24} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>История заказов</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onStolPress} style={styles.floatingButton}>
                <View>
                    <Icon name="table" size={32} color="#ffffff" />
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default TopBar;