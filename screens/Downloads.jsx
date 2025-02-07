import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import DCard from "../components/dcard";
import { useNavigation } from "@react-navigation/native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { height, width } from "../components/bookCard";
import { downloadPageView } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Menu, PaperProvider } from "react-native-paper";
import {
  EllipsisVerticalIcon,
  FolderOpenIcon,
  ShareIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import { clearToBeDeleted } from "../store/slicer";
import { exportBooks, shareBooks } from "../api/database";
import Snackbar from "../components/Snackbar";

const Downloads = () => {
  const [results, setResults] = useState({});
  const [isloading, setLoading] = useState(false);
  const [error, isError] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [shouldShowAd, setShouldShowAd] = useState(true);
  const db = useSQLiteContext();
  const [menuShown, setMenuShown] = useState(false);
  const [snackShown, setSnackShown] = useState(false);
  const navigation = useNavigation();
  const dispath = useDispatch();
  const books = useSelector((state) => state.books.books);
  async function getData() {
    setLoading(true);

    const result = await db.getAllAsync(
      "SELECT * FROM Downloads ORDER BY ID DESC;"
    );
    setResults(result);
    setLoading(false);
    // console.log("Data : \n" + JSON.stringify(result, undefined, 2));
  }

  const [showAlert, setShowAlert] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await books.forEach(async (element) => {
      await db.runAsync(`DELETE FROM Downloads where Link=$Link`, {
        $Link: `${element.Server}`,
      });
      await FileSystem.deleteAsync(`${element.bookUrl}`);
    });
    dispath(clearToBeDeleted());
    await getData();
    setShowAlert(false);
    // Close alert after deletion
  };

  const handleCancel = () => {
    dispath(clearToBeDeleted());
    setShowAlert(false); // Close alert if user cancels
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      dispath(clearToBeDeleted());
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Image
            source={require("../assets/icons/0.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <View
            style={{
              flexDirection: "row",
              width: width * 0.64,
              justifyContent: "space-between",
              marginRight: 20,
              alignItems: "center",
              alignSelf: "flex-end",
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 28,
              }}
            >
              {books.length === 0 ? "Downloads" : "Selected : " + books.length}
            </Text>
            {books.length === 0 ? (
              <></>
            ) : (
              <Menu
                visible={menuShown}
                onDismiss={() => {
                  setMenuShown(false);
                  // dispath(clearToBeDeleted());
                }}
                style={{ paddingTop: 70 }}
                anchor={
                  <TouchableOpacity
                    onPress={() => {
                      setMenuShown(true);
                    }}
                    hitSlop={30}
                  >
                    <EllipsisVerticalIcon size={28} color={"white"} />
                  </TouchableOpacity>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setSnackShown(true);
                  }}
                  title="Export"
                  leadingIcon={() => (
                    <FolderOpenIcon color={"white"} size={25} />
                  )}
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    if (books.length > 1) {
                      return;
                    }
                    shareBooks(books, dispath);
                  }}
                  title="Share"
                  titleStyle={{ color: books.length > 1 ? "grey" : "white" }}
                  leadingIcon={() => (
                    <ShareIcon
                      color={books.length > 1 ? "grey" : "white"}
                      size={25}
                    />
                  )}
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setShowAlert(true);
                  }}
                  title="Delete"
                  leadingIcon={() => <TrashIcon color={"red"} size={25} />}
                />
              </Menu>
            )}
          </View>
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
                  dispatch={dispath}
                  selector={useSelector}
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
        {showAlert && (
          <View style={styles.alertContainer}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>
                Are you sure you want to delete this items?
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <View style={{ position: "absolute", bottom: 1 }}>
          {snackShown ? (
            <Snackbar setShown={setSnackShown} exports={books} />
          ) : (
            <BannerAd
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              unitId="ca-app-pub-5482160285556109/4302126257"
            />
          )}
        </View>
      </View>
    </PaperProvider>
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
  deleteButton: {
    padding: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  alertContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay to dim background
  },
  alertBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: 300,
    maxWidth: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android shadow effect
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
  },
});
