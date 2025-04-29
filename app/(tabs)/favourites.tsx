import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import Styles from "@/constants/Styles";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { PagerHeader } from "@/components/Headers";

const Favourites = () => {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView style={Styles.container}>
      <PagerHeader title={"Favourites"} />
    </ThemedView>
  );
};

export default Favourites;
