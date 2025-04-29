import { StyleSheet, Image, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import Styles from "@/constants/Styles";
import { PagerHeader } from "@/components/Headers";

export default function TabTwoScreen() {
  return (
    <ThemedView style={Styles.container}>
      <PagerHeader title={"Bookmarks"} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
