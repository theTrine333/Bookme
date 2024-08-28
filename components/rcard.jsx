import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { React, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSQLiteContext } from "expo-sqlite/next";

const RCard = ({
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

  async function deleteRec() {
    await db.runAsync(`DELETE FROM Recent where Link=$Link`, {
      $Link: `${download_server}`,
    });
  }
  return (
    <TouchableOpacity
      onPress={() => {
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
            resizeMode: "contain",
          }}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.heading} numberOfLines={2}>
            {Title}
          </Text>
          <Text style={styles.subHeading} numberOfLines={3}>
            Author(s) : {authors}
          </Text>
          <Text style={styles.subHeading}>
            Lang : {lang} | Size : {size} | {Ext} |{" "}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 10,
          paddingTop: 10,
          paddingRight: 10,
          marginBottom: 10,
        }}
        onPress={() => {
          deleteRec();
        }}
      >
        <AntDesign name="closecircleo" size={20} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default RCard;
const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 12,
    padding: 5,
    borderWidth: 0.5,
    width: "95%",
    marginLeft: 6,
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
    width: "65%",
  },
});
