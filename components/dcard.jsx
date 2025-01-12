import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { React, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSQLiteContext } from "expo-sqlite";
import { height, width } from "./bookCard";
import * as FileSystem from "expo-file-system";
const DCard = ({
  bookUrl,
  Title,
  Description,
  bookPoster,
  authors,
  lang,
  size,
  Ext,
  download_server,
  reloadFunction,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, isLoading] = useState(false);
  const navigation = useNavigation();
  const db = useSQLiteContext();

  async function deleteDown() {
    await db.runAsync(`DELETE FROM Downloads where Link=$Link`, {
      $Link: `${download_server}`,
    });
    await FileSystem.deleteAsync(bookUrl).then(reloadFunction);
  }
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Reader", {
          Poster: bookPoster || "https://libgen.li/img/blank.png",
          bookTitle: Title,
          authors: authors,
          lang: lang,
          size: size,
          Ext: Ext,
          description: Description,
          bookUrl: bookUrl,
          Server: download_server,
        });
      }}
      onLongPress={() => {
        Alert.alert(
          "Delete invocked",
          "You have long pressed this item. Do you wish to delete it?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {},
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                deleteDown();
              },
            },
          ]
        );
      }}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: bookPoster || "https://libgen.li/img/blank.png" }}
          style={{
            height: 100,
            width: 100,
            borderRadius: 8,
            resizeMode: "contain",
          }}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.heading} numberOfLines={3}>
            {Title}
          </Text>
          {authors === "" ? (
            <></>
          ) : (
            <Text style={styles.subHeading} numberOfLines={3}>
              Author(s) : {authors}
            </Text>
          )}

          <Text style={styles.subHeading}>
            Language : {lang} | Size : {size} | {Ext} |{" "}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 5,
          width: "98%",
          height: height * 0.001,
          borderWidth: 0.3,
          borderColor: "lightgrey",
          alignSelf: "center",
        }}
      />
    </TouchableOpacity>
  );
};

export default DCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
  },
  heading: {
    fontWeight: "bold",
  },
  subHeading: {
    fontSize: 12,
  },
  detailsContainer: {
    gap: 5,
    alignContent: "flex-start",
    justifyContent: "flex-start",
    width: width * 0.68,
  },
});
