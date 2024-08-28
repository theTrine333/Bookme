import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import Card from "../components/bookCard";
import { ActivityIndicator } from "react-native";
import { getSearch } from "../api/api";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";

export default function Home() {
  const [isLoading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [error, isError] = useState(false);
  const [isFetched, setFetched] = useState(false);
  const [results, setResults] = useState([]);

  const bannerRef = useRef(null);

  useForeground(() => {
    Platform.OS === "ios" && bannerRef.current?.load();
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchbox}>
        <TextInput
          placeholder="Search for a book"
          style={styles.textInput}
          onChangeText={(text) => {
            setSearchText(text);
          }}
          onSubmitEditing={() => {
            setLoading(true);
            setFetched(true);
            {
              setResults(new Array(0));
              getSearch(searchText, setLoading, isError)
                .then((books) => {
                  // Process the books here
                  if (books.length == 0) {
                    isError(true);
                  } else {
                    books.forEach((book) => {
                      results.push(book);
                    });
                    // setResults(books)
                    setLoading(false);
                    setResults((prevResults) => [...prevResults, ...books]);
                  }
                  // Continue with the execution after processing books
                })
                .catch((error) => {
                  isError(true);
                  console.log(error);
                });
            }
          }}
        />
      </View>

      <View style={styles.resultView}>
        {isLoading ? (
          <ActivityIndicator size="large" color={"rgba(255,140,0,255)"} />
        ) : error ? (
          <View style={{ alignContent: "center", justifyContent: "center" }}>
            <Text style={{ textAlign: "center", color: "#E3002A" }}>
              Something went wrong
            </Text>
            <Text style={{ textAlign: "center" }}>
              Can't fetch data at the moment
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setLoading(true);
                setFetched(true);

                setResults(new Array(0));
                getSearch(searchText, setLoading, isError)
                  .then((books) => {
                    // Process the books here
                    if (books.length == 0) {
                      isError(true);
                    } else {
                      books.forEach((book) => {
                        results.push(book);
                      });
                      // setResults(books)
                      setLoading(false);
                      setResults((prevResults) => [...prevResults, ...books]);
                    }
                    // Continue with the execution after processing books
                  })
                  .catch((error) => {
                    isError(true);
                  });
              }}
            >
              <Text style={{ textAlign: "center" }}>Retry</Text>
            </TouchableOpacity>
            <BannerAd
              size={BannerAdSize.FULL_BANNER}
              unitId="ca-app-pub-5482160285556109/4302126257"
            />
          </View>
        ) : results.length == 0 && isFetched ? (
          <View>
            <Text style={{ textAlign: "center", color: "#E3002A" }}>
              No results found
            </Text>
            <BannerAd
              ref={bannerRef}
              unitId={"ca-app-pub-5482160285556109/4302126257"}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
          </View>
        ) : (
          <>
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
              contentContainerStyle={{ gap: 10 }}
              vertical
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <BannerAd
                  ref={bannerRef}
                  unitId={"ca-app-pub-5482160285556109/4302126257"}
                  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                />
                // <BannerAd
                //     size={BannerAdSize.FULL_BANNER}
                //     unitId=""
                //     requestOptions={{
                //         requestNonPersonalizedAdsOnly: true,
                //     }}
                //     onAdLoaded={() => {}}
                //     onAdFailedToLoad={() => {}}
                // />
              }
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 45,
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
    width: "90%", //Was 80%
    borderRadius: 8,
    paddingLeft: 20,
    backgroundColor: "rgb(180,180,180)",
  },
  resultView: {
    // backgroundColor:'rgba(220,220,220)',
    display: "flex",
    width: "100%",
    height: "95%",
    paddingRight: 20,
    paddingLeft: 10,
    flexDirection: "column",
    paddingTop: 10,
  },
  retryButton: {
    paddingTop: 10,
    marginLeft: 10,
    paddingBottom: 10,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: "rgb(255,130,0,1)",
    borderRadius: 10,
  },
});
