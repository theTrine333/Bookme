import { View, Text, ActivityIndicator, useColorScheme } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import Styles, { height, width } from "@/constants/Styles";
import { Image } from "expo-image";
import { Colors } from "@/constants/Colors";

const Splash = () => {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <ThemedView
      style={[
        Styles.container,
        { justifyContent: "center", gap: 20, alignItems: "center" },
      ]}
    >
      <Image
        source={require("@/assets/images/0.png")}
        contentFit="contain"
        style={{
          height: height * 0.3,
          width: width * 0.8,
          alignSelf: "center",
        }}
      />
      <ActivityIndicator color={Colors[colorScheme].icon} />
    </ThemedView>
  );
};

export default Splash;
