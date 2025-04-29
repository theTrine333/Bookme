import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { ThemedView } from "@/components/ThemedView";
import { PagerHeader } from "@/components/Headers";
import Styles, { height } from "@/constants/Styles";
import Button from "@/components/CustomButtons";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/contexts/authContext";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";
import { useConfigs } from "@/contexts/configsContext";

const Settings = () => {
  const theme = useColorScheme() ?? "light";
  const context = useContext(AuthContext);
  const configContext = useConfigs();
  return (
    <ThemedView style={Styles.container}>
      <PagerHeader title="Settings" />
      <ThemedText style={{ fontWeight: "bold" }}>Theme</ThemedText>
      {/* Theme section */}
      <ThemedView
        style={{
          backgroundColor: Colors[theme].blur,
          width: "100%",
          borderRadius: 10,
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-around",
          height: height * 0.15,
        }}
      >
        {/* System theme */}
        <TouchableOpacity
          style={{
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            configContext.toggleTheme("system");
          }}
        >
          <MaterialCommunityIcons
            name="theme-light-dark"
            color={configContext.theme == "system" ? Colors.dark.icon : "grey"}
            size={40}
          />
          <ThemedText
            style={{
              fontSize: 12,
              color:
                configContext.theme == "system" ? Colors.dark.icon : "grey",
            }}
          >
            System
          </ThemedText>
        </TouchableOpacity>
        {/* Light mode */}
        <TouchableOpacity
          style={{
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            configContext.toggleTheme("light");
          }}
        >
          <MaterialIcons
            name="light-mode"
            color={configContext.theme == "light" ? Colors.dark.icon : "grey"}
            size={40}
          />
          <ThemedText
            style={{
              fontSize: 12,
              color: configContext.theme == "light" ? Colors.dark.icon : "grey",
            }}
          >
            Light
          </ThemedText>
        </TouchableOpacity>
        {/* Dark mode */}
        <TouchableOpacity
          style={{
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            configContext.toggleTheme("dark");
          }}
        >
          <MaterialIcons
            name="dark-mode"
            color={configContext.theme == "dark" ? Colors.dark.icon : "grey"}
            size={40}
          />
          <ThemedText
            style={{
              fontSize: 12,
              color: configContext.theme == "dark" ? Colors.dark.icon : "grey",
            }}
          >
            Dark
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <Button
        Title="Logout"
        subTitle="Logout from this device"
        rightIcon={
          <Ionicons
            name="log-out-outline"
            size={20}
            color={Colors[theme].icon}
          />
        }
        action={() => {
          context.Logout();
        }}
      />
    </ThemedView>
  );
};

export default Settings;
