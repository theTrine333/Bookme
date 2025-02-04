import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { height, width } from "./bookCard";
import { Pie } from "react-native-progress";

const Snackbar = () => {
  return (
    <View style={styles.snackContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.snackText}>Exporting...</Text>
        <Text style={styles.snackBodyText} numberOfLines={1}>
          Java Programming
        </Text>
      </View>
      <Pie
        size={30}
        style={styles.snackPie}
        progress={0.5}
        // indeterminate={true}
        color="#FF5722"
      />
    </View>
  );
};

export default Snackbar;

const styles = StyleSheet.create({
  snackContainer: {
    elevation: 4,
    backgroundColor: "lightgrey",
    flexDirection: "row",
    borderRadius: 8,
    alignSelf: "center",
    height: height * 0.06,
    marginHorizontal: 10,
    marginVertical: 7,
    justifyContent: "space-between",
    padding: 10,
    minWidth: width * 0.95,
  },
  snackText: {
    fontWeight: "bold",
    fontSize: 11,
  },
  snackBodyText: {
    fontSize: 10,
    color: "#FF5722",
  },
  textContainer: {
    width: width * 0.8,
    justifyContent: "center",
  },
  snackPie: { alignSelf: "center" },
});
