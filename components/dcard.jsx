import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { React, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSQLiteContext } from "expo-sqlite";
import { height, width } from "./bookCard";
import * as FileSystem from "expo-file-system";
import { ImageBackground } from "expo-image";
import Feather from "@expo/vector-icons/Feather";
import { addToBeDeleted, removeFromToBeDeleted } from "../store/slicer";
import { isInJsonArray } from "../api/database";
const DCard = ({
  dispatch,
  selector,
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
  const [selected, setSelected] = useState(false);
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const books = selector((state) => state.books.books);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setSelected(isInJsonArray(books, bookUrl));
  }, [books]);

  // Check if file was exists downloaded

  const checkBook = async () => {
    const fileName = `${Title}`.replace(" ", "_");
  };

  useEffect(() => {});

  async function deleteDown() {
    await db.runAsync(`DELETE FROM Downloads where Link=$Link`, {
      $Link: `${download_server}`,
    });
    await FileSystem.deleteAsync(bookUrl).then(reloadFunction);
  }
  return (
    <TouchableOpacity
      onPress={() => {
        if (selected) {
          dispatch(
            removeFromToBeDeleted({
              bookUrl: bookUrl,
              Server: download_server,
            })
          );
          setSelected(false);
          return;
        } else if (!selected && books.length > 0) {
          setSelected(true);
          dispatch(
            addToBeDeleted({
              Poster: bookPoster || "https://libgen.li/img/blank.png",
              bookUrl: bookUrl,
              Server: download_server,
            })
          );
          return;
        }
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
        if (!selected) {
          dispatch(
            addToBeDeleted({
              Poster: bookPoster || "https://libgen.li/img/blank.png",
              bookUrl: bookUrl,
              Server: download_server,
            })
          );
          setSelected(true);
        }
      }}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: bookPoster || "https://libgen.li/img/blank.png" }}
          style={{
            height: 100,
            width: 100,
            borderRadius: 8,
            opacity: selected ? 0.5 : 1,
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
        {selected ? (
          <Feather
            name="check-square"
            size={20}
            color="#FF5722"
            style={styles.checkIcon}
          />
        ) : books.length > 0 ? (
          <Feather
            name="square"
            size={20}
            color="grey"
            style={styles.checkIcon}
          />
        ) : (
          <></>
        )}
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
    width: width * 0.98,
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
    width: width * 0.6,
  },
  checkIcon: { alignSelf: "center" },
});
