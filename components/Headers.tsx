import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { Image } from "expo-image";
import Styles from "@/constants/Styles";
import { Colors } from "@/constants/Colors";
import blurhash from "@/constants/blurhash";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ThemedText } from "./ThemedText";
import { HeaderElement } from "@/types";

const Headers = () => {
  const theme = useColorScheme() ?? "light";
  const router = useRouter();
  return (
    <ThemedView
      style={{
        paddingBottom: 10,
        marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "lightgrey",
      }}
    >
      <Image
        source={{ uri : "https://avatars.githubusercontent.com/u/148716108?v=4" }}
        style={Styles.avatarBtn}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <TouchableOpacity
          style={{
            padding:2,
            borderRadius: 50,
            backgroundColor: Colors[theme].blur,
          }}
          onPress={() => {
            router.push("/settings");
          }}
        >
          <Ionicons name="cog" color={Colors[theme].icon} size={35} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export const PagerHeader = ({
  title,
  leftIcon,
  leftIconAction,
  rightIcon,
  rightIconAction,
}: HeaderElement) => {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView
      style={{
        flexDirection: "row",
        borderBottomWidth: 1,
        backgroundColor: "transparent",
        borderColor: "lightgrey",
        alignItems: "center",
        padding: 10,
        marginBottom: 10,
        justifyContent: !(leftIcon || rightIcon) ? "center" : "space-between",
      }}
    >
      {leftIcon && (
        <TouchableOpacity
          style={Styles.headerButtons}
          hitSlop={20}
          onPress={leftIconAction || null}
        >
          {leftIcon}
        </TouchableOpacity>
      )}
      <ThemedText
        style={{
          // color: "black",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        {title}
      </ThemedText>

      {rightIcon && (
        <TouchableOpacity
          style={Styles.headerButtons}
          hitSlop={20}
          onPress={rightIconAction || null}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </ThemedView>
  );
};
export default Headers;
