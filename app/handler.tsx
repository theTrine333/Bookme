import { View, Text, Alert, useColorScheme } from "react-native";
import React, { useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, useRouter } from "expo-router";
import { handlerParamas } from "@/types";
import Splash from "@/components/Splash";
import { copyContentFileToCache } from "@/api/q";
import Styles, { height, width } from "@/constants/Styles";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { PagerHeader } from "@/components/Headers";

const Handler = () => {
  const params: handlerParamas = useLocalSearchParams();
  const name = params.name;
  const theme = useColorScheme() ?? "light";
  const { __EXPO_ROUTER_key, ...newParams } = params;
  const router = useRouter();
  const handleLinking = async () => {
    // if (params.url?.endsWith(".pdf")) return;
    // Alert.alert("Started : ", params?.url);
    // await copyContentFileToCache(newParams)
    //   .then((e) => {
    //     Alert.alert("Completed coping file");
    //   })
    //   .catch((e) => {
    //     Alert.alert("An error occured : ", e);
    //   });
  };
  useEffect(() => {
    handleLinking();
  }, []);
  return (
    <ThemedView style={Styles.container}>
      <PagerHeader title="File Handler" />
      <ThemedView
        style={{
          alignSelf: "center",
          height: height * 0.84,
          justifyContent: "center",
          alignItems: "center",
        }}
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
        <ThemedText
          style={{ fontWeight: "bold", fontSize: 24, color: Colors.dark.icon }}
        >
          Bookme
        </ThemedText>
        <ThemedText
          style={{
            padding: 5,
            fontSize: 14,
            fontFamily: "SpaceMono",
            textAlign: "center",
            alignSelf: "center",
            color: theme == "light" ? Colors.constants.red : Colors.dark.text,
          }}
        >
          This functionality is still under development and will be supported
          soon
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default Handler;
