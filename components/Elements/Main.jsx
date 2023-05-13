import { Text, View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import React, { useState } from "react";
import TopBar from "../UI/TopBar";
import { Stack, Button, Flex, Box, Spacer, Divider } from "@react-native-material/core";


const Main = () => {
    return (
        <View>
            <TopBar/>
            <StatusBar/>
            <View>
                <Button title="Button" color="pink" tintColor="red" />
                <Button title="Button" color="pink" tintColor="red" />
            </View>
        </View>
    );
}

export default Main;