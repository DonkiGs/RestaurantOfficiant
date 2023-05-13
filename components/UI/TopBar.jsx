import React, { useState } from "react";
import { AppBar, IconButton, HStack } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import SideBar from "./SideBar";

const TopBar = () => (
    <AppBar
        title="Мой Ресторан"
        color="pink"
        tintColor="black"
        trailing={props => (
            <HStack>
                <IconButton
                    icon={props => <Icon name="account" {...props} />}
                    color="black"
                />
            </HStack>
        )}
    />
);

export default TopBar;