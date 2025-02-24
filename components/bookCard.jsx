import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { React, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import details from "./details";
import { useSQLiteContext } from "expo-sqlite";
import { Image } from "expo-image";
const Card = ({
  bookUrl,
  Title,
  Description,
  bookPoster,
  authors,
  lang,
  size,
  Ext,
  download_server,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, isLoading] = useState(false);
  const navigation = useNavigation();
  const db = useSQLiteContext();

  async function insertTransaction() {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `
        INSERT INTO Recent (title,authors,description,poster,lang,size,book_url,download_server,Ext) VALUES (?,?,?,?,?,?,?,?,?);
      `,
        [
          Title,
          authors,
          Description,
          bookPoster,
          lang,
          size,
          bookUrl,
          download_server,
          Ext,
        ]
      );
    });
  }

  return (
    <TouchableOpacity
      onPress={() => {
        insertTransaction();
        navigation.navigate("Details", {
          Poster: bookPoster || "https://libgen.li/img/blank.png",
          title: Title,
          authors: authors,
          lang: lang,
          size: size,
          Ext: Ext,
          description: Description,
          bookurl: bookUrl,
          Server: download_server,
        });
      }}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: bookPoster || "https://libgen.li/img/blank.png" }}
          style={{
            height: 100,
            width: 100,
            borderRadius: 8,
          }}
          resizeMode="contain"
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

export default Card;
export const { height, width } = Dimensions.get("screen");
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
