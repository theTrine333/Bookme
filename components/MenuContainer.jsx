import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import { height, width } from "./bookCard";
import MenuItem from "./MenuItem";
import { XCircleIcon } from "react-native-heroicons/outline";

const MenuContainer = ({ children, shown = false, setShown = null }) => {
  return (
    <Modal
      visible={shown}
      transparent={true}
      onRequestClose={() => {
        setShown(false);
      }}
    >
      <View style={styles.container}>
        {children}
        <MenuItem
          Icon={() => <XCircleIcon color={"red"} size={28} />}
          text="Close"
          action={() => {
            setShown(false);
          }}
          lastItem={true}
        />
      </View>
    </Modal>
  );
};

export default MenuContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(240,240,240)",
    minHeight: height * 0.06,
    minWidth: width * 0.4,
    position: "absolute",
    top: 40,
    right: 20,
    borderRadius: 15,
    borderCurve: "continuous",
    elevation: 4,
    alignItems: "center",
  },
});
