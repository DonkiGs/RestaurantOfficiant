import { View, TextInput, Text, Alert, StatusBar, StyleSheet, Switch, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Feather";
import styles from "../Styles/AuthForm_Styles";
import Tooltip from 'react-native-tooltip';
import History from "./History";

const AuthForm = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const [loginTooltipVisible, setLoginTooltipVisible] = useState(false);
    const [passwordTooltipVisible, setPasswordTooltipVisible] = useState(false);

    const handleUsernameChange = (text) => {
        setLogin(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const handleShowPasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = () => {
        fetch('http://192.168.0.102:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: login,
                password: password,
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401) {
                    throw new Error('Неверный логин или пароль');
                } else {
                    throw new Error('Ошибка сервера');
                }
            })
            .then((data) => {
                const { FIO, employee_id } = data;
                navigation.navigate('Main', { FIO, employee_id });
            })
            .catch((error) => {
                console.error('Ошибка:', error);
                Alert.alert("Неправильный логин или пароль", "Попробуйте позже");
            });
    };

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={login}
                    onChangeText={handleUsernameChange}
                    placeholder="Логин..."
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        value={password}
                        onChangeText={handlePasswordChange}
                        secureTextEntry={!showPassword}
                        placeholder="Пароль..."
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity
                        style={styles.showPasswordButton}
                        onPress={handleShowPasswordToggle}
                    >
                        <Icon
                            name={showPassword ? "eye" : "eye-off"}
                            size={24}
                            color="#888"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Войти</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AuthForm;