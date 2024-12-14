import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import DCard from "../components/dcard";
import { useNavigation } from "@react-navigation/native";
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";
import { height, width } from "../components/bookCard";
import { downloadPageView } from "../api/api";
const Downloads = () => {
  const [results, setResults] = useState({});
  const [isloading, setLoading] = useState(false);
  const [error, isError] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [shouldShowAd, setShouldShowAd] = useState(true);
  const db = useSQLiteContext();
  const navigation = useNavigation();

  async function getData() {
    setLoading(true);

    const result = await db.getAllAsync(
      "SELECT * FROM Downloads ORDER BY ID DESC;"
    );
    setResults(result);
    setLoading(false);
    // console.log("Data : \n" + JSON.stringify(result, undefined, 2));
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Image
          source={require("../assets/icons/0.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 28,
          }}
        >
          Downloads
        </Text>
      </View>
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
          style={{
            alignSelf: "center",
            height: height * 0.4,
            width: width * 0.9,
            marginTop: 10,
            justifyContent: "center",
            alignContent: "center",
          }}
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
        <View
          style={{
            alignSelf: "center",
            maxHeight: height * 0.57,
            minWidth: width * 0.97,
            backgroundColor: '"rgb(220,220,220)',
            borderRadius: 12,
            paddingTop: 10,
            marginTop: 10,
          }}
        >
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
                reloadFunction={getData}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ gap: 10, paddingBottom: 60 }}
            vertical
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      <View style={{ position: "absolute", bottom: 1 }}>
        <BannerAd
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          unitId="ca-app-pub-5482160285556109/4302126257"
        />
      </View>
    </View>
  );
};

export default Downloads;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView: {
    backgroundColor: "grey",
    alignItems: "center",
    paddingTop: 100,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 20,
  },
  searchbox: {
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    height: 40,
    gap: 10,
  },
  textInput: {
    width: width * 0.96, //Was 80%
    borderRadius: 8,
    paddingLeft: 10,
    backgroundColor: "rgb(180,180,180)",
  },
  rowView: {
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  image: {
    height: 120,
    width: 120,
  },
  retryButton: {
    paddingTop: 10,
    alignSelf: "center",
    width: width * 0.8,
    height: height * 0.05,
    paddingBottom: 10,
    paddingLeft: 40,
    marginTop: 5,
    paddingRight: 40,
    backgroundColor: "rgb(255,130,0)",
    borderRadius: 10,
  },
});
