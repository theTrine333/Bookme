import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Card, { height, width } from "../components/bookCard";
import { ActivityIndicator } from "react-native";
import { getSearch } from "../api/api";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { StatusBar } from "expo-status-bar";
import * as IconsOutline from "react-native-heroicons/outline";
import { useSQLiteContext } from "expo-sqlite";
export default function Home({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [error, isError] = useState(false);
  const [isFetched, setFetched] = useState(false);
  const [results, setResults] = useState([]);
  const db = useSQLiteContext();
  async function getData() {
    const result = await db.getAllAsync(
      `SELECT * FROM Recent ORDER BY ID DESC;`
    );
    setResults(result);
    setLoading(false);
    // console.log("Data : \n" + JSON.stringify(result, undefined, 2));
  }

  const fetchBook = async () => {
    setLoading(true);
    getSearch(searchText)
      .then((books) => {
        setLoading(false);
        // console.log("Books", books.length);
        if (books.length === 0) {
          isError(true);
        } else {
          isError(false);
          setResults(books);
          // console.log(
          //   "Books fetched : \n" + JSON.stringify(books, undefined, 2)
          // );
        }
      })
      .catch((error) => {
        isError(true);
      });
  };

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <View style={styles.rowView}>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../assets/icons/0.png")}
              style={styles.image}
              resizeMode="contain"
            />
            <View>
              <Text style={{ fontWeight: "bold" }}>Bookme</Text>
              <Text style={{ fontSize: 12, color: "lightgrey" }}>
                All in the library
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: 5,
              paddingRight: 20,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate("Downloads");
                navigation.navigate("Reader");
              }}
            >
              <IconsOutline.FolderArrowDownIcon size={28} color={"white"} />
            </TouchableOpacity>
            {/* <TouchableOpacity>
              <IconsOutline.CogIcon size={31} color={"black"} />
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={styles.searchbox}>
          <TextInput
            placeholder="Search for a book"
            style={styles.textInput}
            onChangeText={(text) => {
              setSearchText(text);
            }}
            onSubmitEditing={fetchBook}
          />
        </View>
        {/* Version */}
        <Text
          style={{
            textAlign: "center",
            fontSize: 10,
            paddingTop: 10,
          }}
        >
          V1.0.16
        </Text>
      </View>
      <View>
        {isLoading ? (
          <ActivityIndicator
            size={25}
            color={"rgb(255,140,0)"}
            style={{ marginTop: 10 }}
          />
        ) : error ? (
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ textAlign: "center", color: "#E3002A" }}>
              Something went wrong
            </Text>
            <Text style={{ textAlign: "center" }}>
              Can't fetch data at the moment
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchBook}>
              <Text style={{ textAlign: "center" }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : results.length == 0 && isFetched ? (
          <View>
            <Text style={{ textAlign: "center", color: "#E3002A" }}>
              No results found
            </Text>
            <BannerAd
              unitId={"ca-app-pub-5482160285556109/4302126257"}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
          </View>
        ) : (
          <View
            style={{
              alignSelf: "center",
              // minHeight: height * 0.723,
              // maxHeight: height * 0.78,
              maxHeight: height * 0.723,
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
                <Card
                  bookPoster={item.poster}
                  Title={item.title}
                  Description={item.description}
                  lang={item.lang}
                  size={item.size}
                  authors={item.authors}
                  Ext={item.Ext}
                  bookUrl={item.book_url}
                  download_server={item.download_server}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ gap: 10, paddingBottom: 40 }}
              vertical
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
      <View style={{ position: "absolute", bottom: 1 }}>
        <BannerAd
          unitId={"ca-app-pub-5482160285556109/4302126257"}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView: {
    backgroundColor: "grey",
    paddingTop: 45,
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
    height: 40,
    width: 40,
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
