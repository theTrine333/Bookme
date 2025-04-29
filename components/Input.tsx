import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useState } from "react";
import { ThemedView } from "./ThemedView";
import { CustomTextInputProp } from "@/types";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import Styles from "@/constants/Styles";
import { Colors } from "@/constants/Colors";

export const CustomTextInput = ({
  placeholderText,
  setter,
  isPassField,
  keyboardType,
  isBio,
  isSearch,
  style,
  isEmail,
  submitFunction,
}: CustomTextInputProp) => {
  const [isFocused, setIsFocused] = useState(false);
  const [passShwon, setPassShwo] = useState(false);
  const [search, setSearch] = useState("");
  const theme = useColorScheme() ?? "light";
  if (isSearch) {
    return (
      <>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: Colors[theme].blur },
            style,
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder={placeholderText}
            placeholderTextColor={"grey"}
            onChangeText={(e) => {
              setSearch(e);
              setter(e);
            }}
            cursorColor={Colors[theme].icon}
            onSubmitEditing={() => {
              submitFunction();
            }}
            autoFocus
            autoCapitalize="none"
            value={search}
            style={[
              styles.searchInput,
              { color: theme == "dark" ? Colors.dark.icon : Colors.light.text },
            ]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {search && (
            <TouchableOpacity
              onPress={() => {
                setter("");
                setSearch("");
              }}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors[theme].icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }
  if (isEmail) {
    return (
      <ThemedView
        style={[
          Styles.textInput,
          isBio && { height: "40%" },
          { borderWidth: isFocused ? 1 : 0, borderColor: Colors[theme].text },
          style,
        ]}
      >
        <TextInput
          placeholder={placeholderText}
          multiline={isBio ? true : false}
          placeholderTextColor={"grey"}
          onChangeText={setter}
          keyboardType={keyboardType}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          numberOfLines={5}
          style={[Styles.textInputField, { color: Colors[theme].text }]}
        />
      </ThemedView>
    );
  }
  return (
    <ThemedView
      style={[
        Styles.textInput,
        isBio && { height: "40%" },
        { borderWidth: isFocused ? 1 : 0, borderColor: Colors[theme].text },
        style,
      ]}
    >
      <TextInput
        placeholder={placeholderText}
        multiline={isBio ? true : false}
        onChangeText={setter}
        placeholderTextColor={"grey"}
        secureTextEntry={!passShwon}
        keyboardType={keyboardType}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => setIsFocused(false)}
        numberOfLines={5}
        style={[
          Styles.textInputField,
          {
            color: Colors[theme].text,
          },
        ]}
      />

      {isPassField ? (
        <TouchableOpacity
          hitSlop={20}
          style={{ alignSelf: "center" }}
          onPress={() => {
            setPassShwo(!passShwon);
          }}
        >
          {passShwon ? (
            <Ionicons name="eye" size={20} color={Colors[theme].text} />
          ) : (
            <Ionicons name="eye-off" size={20} color={Colors[theme].text} />
          )}
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  scannerButton: {
    padding: 4,
    marginRight: 4,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  scannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeButton: {
    padding: 8,
  },
  scannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  scanner: {
    flex: 1,
  },
  scannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#fff",
    borderWidth: 2,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanAgainButton: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  scanAgainText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  markdownContainer: {
    width: "100%",
    gap: 10,
  },
  markdownInputContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  markdownInput: {
    minHeight: 100,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
  },
  markdownToolbar: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  toolbarButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  toolbarText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  previewContainer: {
    marginTop: 8,
    borderRadius: 8,
    padding: 16,
    maxHeight: 200,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  previewContent: {
    maxHeight: 150,
  },
});

export const ORDivider = () => {
  return (
    <View
      style={{
        width: "90%",
        alignSelf: "center",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <ThemedView
        style={{
          borderWidth: 0.3,
          borderColor: "grey",
          width: "40%",
          alignSelf: "center",
        }}
      />
      <ThemedText>or</ThemedText>
      <ThemedView
        style={{
          borderColor: "grey",
          borderWidth: 0.3,
          width: "40%",
          alignSelf: "center",
        }}
      />
    </View>
  );
};
