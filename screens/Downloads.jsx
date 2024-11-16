import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import DCard from "../components/dcard";
import { useNavigation } from "@react-navigation/native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const Downloads = () => {
  const [results, setResults] = useState({});
  const [isloading, setLoading] = useState(false);
  const [error, isError] = useState(false);
  const db = useSQLiteContext();
  const navigation = useNavigation();

  async function getData() {
    const result = await db.getAllAsync(
      "SELECT * FROM Downloads ORDER BY ID DESC;"
    );
    setResults(result);
    /* console.log("Data : \n" + JSON.stringify(result, undefined, 2)); */
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Function to run when the screen is focused
      db.withTransactionAsync(async () => {
        await getData();
      });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      {isloading ? (
        <ActivityIndicator size="large" color={"rgba(255,140,0,255)"} />
      ) : error ? (
        <View>
          <Text style={{ textAlign: "center", color: "#E3002A" }}>
            Something went wrong
          </Text>
          <Text style={{ textAlign: "center" }}>
            Can't load recent books at the moment
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <Image
            source={require("../assets/icons/1.png")}
            style={{
              height: 60,
              width: 60,
              borderRadius: 8,
              resizeMode: "contain",
              alignSelf: "center",
            }}
          />
          <Text
            style={{
              paddingTop: 10,
              color: "rgba(255,140,0,255)",
              textAlign: "center",
            }}
          >
            No downloads yet
          </Text>
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <DCard
                bookPoster={item.Poster}
                Title={item.Title}
                Description={item.Description}
                lang={item.Language}
                size={item.Size}
                authors={item.Authors}
                Ext={item.Extension}
                bookUrl={item.Url}
                download_server={item.Link}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ gap: 10 }}
            vertical
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <BannerAd
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                unitId="ca-app-pub-5482160285556109/4302126257"
              />
            }
          />
        </View>
      )}
    </>
  );
};

export default Downloads;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 45,
  },
});
