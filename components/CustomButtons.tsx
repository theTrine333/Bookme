import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import Styles, { height } from "@/constants/Styles";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
interface props {
  Title: string;
  subTitle?: string;
  rightIcon?: any;
  leftIcon?: string;
  action?: any;
}
const Button = ({ Title, leftIcon, rightIcon, subTitle, action }: props) => {
  const [isFocused, setFocused] = useState(false);
  const theme = useColorScheme() ?? "light";
  return (
    <TouchableOpacity
      style={[
        Styles.textInput,
        {
          width: "100%",
          borderWidth: isFocused ? 1 : 0,
          alignItems: "center",
          justifyContent: "space-between",
          borderColor: "black",
          backgroundColor: Colors[theme].blur,
        },
      ]}
      onPressOut={() => {
        setFocused(false);
      }}
      onPressIn={() => {
        setFocused(true);
      }}
      onPress={() => {
        action && action();
      }}
    >
      {leftIcon && <>{leftIcon}</>}
      <View
        style={{
          justifyContent: "center",
          maxHeight: height * 0.06,
        }}
      >
        <ThemedText
          style={{
            fontWeight: "bold",
            fontSize: 14,
            borderColor: "white",
          }}
        >
          {Title}
        </ThemedText>
        <ThemedText style={{ fontSize: 11, color: "grey" }}>
          {subTitle}
        </ThemedText>
      </View>
      {rightIcon && <>{rightIcon}</>}
    </TouchableOpacity>
  );
};

export default Button;
