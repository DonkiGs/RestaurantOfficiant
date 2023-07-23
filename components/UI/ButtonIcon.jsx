import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import React from "react/index";

const ButtonIcon = () => (
    <TouchableOpacity onPress={() => alert('Touch!')}>
        <Icon name={"fire"}/>
    </TouchableOpacity>
)

export default ButtonIcon;