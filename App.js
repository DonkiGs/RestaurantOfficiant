import React from "react";
import { AppRegistry } from 'react-native';
import AuthForm from "./components/Elements/AuthForm";
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from "./components/Elements/Main";
import History from "./components/Elements/History";
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

enableScreens();

const Stack = createNativeStackNavigator();

AppRegistry.registerComponent('MyApp', () => App);

function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
                    <Stack.Screen
                        name="Auth"
                        component={AuthForm}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Main"
                        component={Main}
                        options={{
                            headerShown: false,
                            stackPresentation: 'modal',
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}

export default App;