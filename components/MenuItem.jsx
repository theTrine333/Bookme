import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { height, width } from "./bookCard";

const MenuItem = ({ Icon, color, action, text, lastItem }) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={[styles.menuItem, lastItem ? { borderBottomWidth: 0 } : <></>]}
    >
      <Icon />
      <View style={styles.verticalDivider} />
      <Text
        style={{
          textAlign: "left",
          width: width * 0.2,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  menuItem: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    flex: 1,
    margin: 3,
    paddingVertical: 5,
    width: width * 0.3,
  },
  verticalDivider: {
    borderWidth: 1,
    height: height * 0.035,
    borderColor: "grey",
  },
});
