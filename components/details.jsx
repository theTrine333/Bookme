import {
  ScrollView,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  View,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";

import { React, useState, useEffect } from "react";
import * as Fetch from "../api/api";
import {
  InterstitialAd,
  AdEventType,
  RewardedInterstitialAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { useSQLiteContext } from "expo-sqlite";
import Octicons from "@expo/vector-icons/Octicons";
import Feather from "@expo/vector-icons/Feather";
import * as Progress from "react-native-progress";
import { StatusBar } from "expo-status-bar";
import * as FileSystem from "expo-file-system";
const adUnitId = "ca-app-pub-5482160285556109/3851781686";
const videoAdUnit = "ca-app-pub-5482160285556109/9470404750";
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ["books", "eference"],
});
const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
  videoAdUnit,
  {
    keywords: ["books", "reference"],
  }
);
const Details = ({ navigation, route }) => {
  const url = route.params.bookurl;
  const [modalVisible, setModalVisible] = useState(false);
  const poster = route.params.Poster;
  const download_server = route.params.Server;
  const [adLoaded, setadLoaded] = useState(false);
  const [downloading, setdownLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [Description, setDescription] = useState("");
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const { width, height } = Dimensions.get("screen");
  const cacheDir = FileSystem.documentDirectory + "Downloads";
  const db = useSQLiteContext();
  async function insertTransaction(fileUrl) {
    await db.runAsync(
      "INSERT INTO Downloads (Title,Authors,Description,Poster,Language,Size,Url,Link,Extension) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        route.params.title,
        route.params.authors,
        route.params.description,
        route.params.Poster,
        route.params.lang,
        route.params.size,
        fileUrl,
        route.params.Server,
        route.params.Ext,
      ]
    );
  }

  async function downloadFile(fileUrl) {
    setModalVisible(true);
    ToastAndroid.show(
      "Downlaod stated, you will receive a notification",
      ToastAndroid.SHORT
    );
    try {
      const title = `${route.params.title}`.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const downloadsPath = `${FileSystem.documentDirectory}Downloads/`;
      const filePath = `${downloadsPath}${title}.pdf`;
      const dirInfo = await FileSystem.getInfoAsync(downloadsPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadsPath, {
          intermediates: true,
        });
        // console.log("Downloads directory created");
      }
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl, // Replace with your file URL
        filePath,
        {},
        (downloadProgress) => {
          const progressPercentage =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          // console.log(progressPercentage);
          setProgress(progressPercentage);
        }
      );

      // Check if the file already exists
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        ToastAndroid.showWithGravityAndOffset(
          "Downlaod completed",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        insertTransaction(filePath);
        setModalVisible(false);
        setdownLoading(false);
        return; // Exit the function if the file exists
      }

      // Download the file
      const { uri } = await downloadResumable.downloadAsync();
      // const result = await FileSystem.downloadAsync(fileUrl, filePath).then(
      //   () => {
      //     ToastAndroid.showWithGravityAndOffset(
      //       "Downlaod completed",
      //       ToastAndroid.LONG,
      //       ToastAndroid.BOTTOM,
      //       25,
      //       50
      //     );
      //   }
      // );
      insertTransaction(filePath);
      setdownLoading(false);
      setModalVisible(false);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  useEffect(() => {
    const rewardunsubscribeLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        // rewardedInterstitial.show();
        // setdownLoading(false);
      }
    );
    const rewardunsubscribeEarned = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward of ", reward);
      }
    );
    rewardedInterstitial.load();
    return () => {
      rewardunsubscribeLoaded();
      rewardunsubscribeEarned();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setadLoaded(true);
      }
    );
    interstitial.load();
    try {
      interstitial.show();
    } catch {}
    Fetch.getBookDetails(url)
      .then((details) => {
        setLoading(false);
        setDescription(details.replace(/\. ([a-zA-Z])/g, ".\n$1"));
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                Downloader
              </Text>
              <Progress.Circle
                progress={progress}
                size={90}
                showsText={true}
                style={{ alignSelf: "center", marginTop: 10 }}
              />
              <Text>Downloading:</Text>
              <Text
                numberOfLines={1}
                style={{ fontWeight: "bold", color: "blue" }}
              >
                {route.params.title}
              </Text>
              <TouchableOpacity
                style={{
                  width: width * 0.73,
                  height: height * 0.04,
                  justifyContent: "center",
                  alignSelf: "center",
                  borderRadius: 12,
                  marginTop: 10,
                  backgroundColor: "#E3002A",
                }}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Dismiss
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: route.params.Poster.replace("_small", "") }}
          style={{
            width: width * 0.95,
            height: height * 0.6,
            borderRadius: 5,
            alignSelf: "center",
          }}
          resizeMode="cover"
        />
        <View style={styles.Divider} />
        <Text style={styles.titleHead}>Title</Text>
        <View style={styles.Divider} />
        <Text style={styles.title}>{route.params.title}</Text>
        <View style={styles.Divider} />
        <Text style={styles.titleHead}>Description</Text>
        <View style={styles.Divider} />
        {loading ? (
          <ActivityIndicator
            size={28}
            color={"rgba(255,140,0,255)"}
            style={{ paddingTop: 10, paddingBottom: 5 }}
          />
        ) : error ? (
          <Text style={[styles.title, { color: "#E3002A" }]}>
            Can't fetch data at the moment
          </Text>
        ) : (
          <Text style={styles.title}>{Description}</Text>
        )}
        <View style={styles.Divider} />
        <View
          style={{ width: width * 0.95, paddingTop: 10, paddingBottom: 10 }}
        >
          <View style={{ flex: 1, alignSelf: "flex-start" }}>
            <BannerAd
              unitId={"ca-app-pub-5482160285556109/8138173373"}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
          </View>
        </View>
      </ScrollView>

      {downloading ? (
        <TouchableOpacity
          style={styles.serverButton}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <ActivityIndicator color={"white"} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.serverButton}
          onPress={() => {
            setdownLoading(true);
            Fetch.extractLink(download_server).then((link) => {
              setStarted(true);
              downloadFile(link);

              // // Linking.openURL(`${link}`);
              // setdownLoading(false);
            });
          }}
        >
          <Octicons name="download" size={20} color={"white"} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.readButton}
        onPress={() => {
          adLoaded ? (
            () => {
              interstitial.show();
            }
          ) : (
            <></>
          );
          Fetch.extractLink(download_server).then((link) => {
            navigation.navigate("Reader", {
              bookUrl: link,
              bookTitle: `${route.params.title}`,
            });
          });
        }}
      >
        <Feather name="book-open" size={20} color={"white"} />
        <Text style={styles.btnText}>READ ONLINE</Text>
      </TouchableOpacity>
      <StatusBar style="dark" />
    </View>
  );
};

export default Details;
const { height, width } = Dimensions.get("screen");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 5,
    paddingTop: 45,
  },
  btnText: {
    fontSize: 10,
    alignSelf: "center",
    paddingLeft: 5,
    color: "white",
  },
  Divider: {
    marginTop: 5,
    borderWidth: 0.5,
    width: width * 0.92,
    marginLeft: 10,
    height: "0.01%",
    borderColor: "lightgrey",
  },
  infoText: {
    fontWeight: "bold",
    color: "blue",
    paddingBottom: 20,
    textAlign: "center",
  },
  Imagebox: {
    alignContent: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 20,
    resizeMode: "contain",
  },
  title: {
    flex: 1,
    lineHeight: 20,
    flexDirection: "row",
    width: "95%",
    fontSize: 12,
    paddingLeft: 20,
    paddingTop: 10,
  },
  titleHead: {
    flex: 1,
    marginTop: 10,
    marginBottom: 5,
    flexDirection: "row",
    width: "95%",
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: 20,
  },
  description: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingLeft: 20,
    marginRight: 10,
  },
  serverButton: {
    flexDirection: "row",
    position: "absolute",
    right: 40,
    bottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,130,0,205)",
    borderRadius: 100,
  },
  readButton: {
    flexDirection: "row",
    position: "absolute",
    Left: 20,
    marginLeft: 40,
    bottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,130,0,205)",
    borderRadius: 100,
  },
  retryButton: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: "rgba(255,130,0,205)",
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
  },
  btns: {
    flex: 1,
    flexDirection: "row",
    alignContent: "space-between",
    gap: 20,
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    position: "absolute",
    bottom: height * 0.38,
    gap: 10,
    flexDirection: "row",
    width: width * 0.8,
    height: height * 0.28,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  modalSubView: {
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 8,
  },
  modalText: {
    fontSize: 11,
    textAlign: "center",
  },
});
