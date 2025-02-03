import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Share,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
  Image,
  Alert,
  Switch,
} from "react-native";
import Pdf from "react-native-pdf";
import AntDesign from "@expo/vector-icons/AntDesign";
import Foundation from "@expo/vector-icons/Foundation";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TextInput } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useSQLiteContext } from "expo-sqlite";
export default function Reader({ navigation, route }) {
  const book_url = route.params.bookUrl;
  const book_Title = route.params.bookTitle;
  const onlineSource = { uri: `${book_url}`, cache: true };
  const [pdfSource, setPdfSource] = useState(onlineSource);
  const pdfRef = useRef();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState("0");
  const [pageText, setpageText] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downlaoding, setDownload] = useState(false);
  const [horizontalView, setHorizontalView] = useState(false);
  const [pageView, setPageView] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const db = useSQLiteContext();
  async function downloadFile() {
    const fileUrl = book_url;
    setDownload(true);
    try {
      const title = `${route.params.title}`.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const downloadsPath = `${FileSystem.documentDirectory}Downloads/`;
      const filePath = `${downloadsPath}${title}.pdf`;
      const dirInfo = await FileSystem.getInfoAsync(downloadsPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadsPath, {
          intermediates: true,
        });
      }

      // Check if the file already exists
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        setDownload(false);
        Alert.alert("File conficts", "The file is already downloaded.", [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {},
          },
        ]);
        return; // Exit the function if the file exists
      }

      // Download the file

      try {
        const result = await FileSystem.downloadAsync(fileUrl, filePath).then(
          () => {
            Alert.alert(
              "Download complete",
              "Your file has been downloaded and is available in your downloads page",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: () => {},
                },
              ]
            );
          }
        );
      } catch (error) {}
      setDownload(false);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }
  function checkUrl(url) {
    if (url.startsWith("https://")) {
      return true;
    } else if (url.startsWith("file://")) {
      return false;
    }
    return null;
  }

  const recorgnizeBook = async () => {
    await db.runAsync(
      `INSERT INTO Reads(name,page) VALUES ('${book_Title}',1);`
    );
  };
  const rememberPage = async () => {
    // setLoading(true);
    await db
      .getFirstAsync(`SELECT page from Reads where name='${book_Title}';`)
      .then((e) => {
        setpageText(Number(e.page));
        // console.log("Data:", e.page);
      });
    // setLoading(false);
  };
  const updatedReadPage = async ({ page }) => {
    await db.runAsync(
      `UPDATE Reads set page=${page} where name='${book_Title}';`
    );
  };

  useEffect(() => {
    const fileState = checkUrl(book_url);
    setIsFile(fileState);
    recorgnizeBook();
    rememberPage();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
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
            <View style={styles.modalSubView}>
              <Text style={styles.modalText}>Page:</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",

                  width: 80,
                  backgroundColor: "lightgrey",
                }}
              >
                <TextInput
                  placeholder={currentPage}
                  cursorColor={"lightgrey"}
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    borderWidth: 0.3,
                    height: height * 0.025,
                    marginLeft: 3,
                    borderRadius: 2,
                    marginVertical: 5,
                    width: "50%",
                    borderColor: "grey",
                  }}
                  keyboardType="numeric"
                  value={pageText}
                  onChangeText={(text) => {
                    let tempPage = currentPage;
                    if (text <= totalPages) {
                      setpageText(text);
                    } else {
                      setpageText(tempPage);
                    }
                  }}
                  onSubmitEditing={() => {
                    setModalVisible(false);
                  }}
                />
                <Text style={{ fontSize: 12 }}>/{totalPages}</Text>
              </View>
            </View>

            <View
              style={[
                styles.modalSubView,
                { alignSelf: "center", padding: 10, alignItems: "center" },
              ]}
            >
              {horizontalView ? (
                <Text style={styles.modalText}>Vertical</Text>
              ) : (
                <Text style={styles.modalText}>Horizontal</Text>
              )}
              <TouchableOpacity
                onPress={() => setHorizontalView(!horizontalView)}
              >
                {horizontalView ? (
                  <FontAwesome name="arrows-h" size={24} color="black" />
                ) : (
                  <FontAwesome name="arrows-v" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.modalSubView,
                { alignSelf: "center", padding: 10, alignItems: "center" },
              ]}
            >
              {pageView ? (
                <Text style={styles.modalText}> Fill View</Text>
              ) : (
                <Text style={styles.modalText}> Fit View</Text>
              )}
              <TouchableOpacity onPress={() => setPageView(!pageView)}>
                {pageView ? (
                  <Foundation name="arrows-out" size={24} color="black" />
                ) : (
                  <Foundation name="arrows-in" size={24} color="black" />
                )}
              </TouchableOpacity>
              {/* <Switch value={pageView} onValueChange={setPageView} /> */}
            </View>
            <TouchableOpacity
              style={[
                styles.modalSubView,
                { alignSelf: "center", padding: 10 },
              ]}
              onPress={async () => {
                if (isFile) {
                  Share.share({
                    message: `Check out this book ${book_Title} at ${book_url} downloaded by Bookme app`,
                    title: "Share Bookme",
                  });
                } else {
                  Sharing.shareAsync(book_url);
                }
              }}
            >
              <Text style={styles.modalText}>Share</Text>
              <AntDesign name="sharealt" size={25} style={{ marginTop: 2 }} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {error ? (
        <Image
          source={require("../assets/icons/error_loading.jpg")}
          style={{
            height: 180,
            width: 180,
            alignSelf: "center",
            position: "absolute",
            bottom: height * 0.4,
            borderRadius: 12,
          }}
        />
      ) : (
        <>
          <Pdf
            trustAllCerts={false}
            ref={pdfRef}
            page={Number(pageText)}
            source={pdfSource}
            onLoadComplete={(numberOfPages, filePath) => {
              setTotalPages(numberOfPages);
              // rememberPage();
              setLoading(false);
            }}
            onPageChanged={(page, numberOfPages) => {
              setCurrentPage(`${page}`);
              updatedReadPage({ page });
            }}
            enableDoubleTapZoom={true}
            enablePaging={pageView}
            horizontal={horizontalView}
            onError={(error) => {
              // console.log(error);
              setError(true);
              setLoading(false);
            }}
            onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              alignSelf: "center",
              height: height * 0.06,
              width: width * 0.2,
              borderColor: "grey",
              elevation: 4,
              backgroundColor: "white",
              borderRadius: 8,
              bottom: 20,
              flex: 1,
              gap: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={styles.pageText}>
              {currentPage}/{totalPages}
            </Text>
            <AntDesign name="menufold" size={15} color="grey" />
          </TouchableOpacity>
        </>
      )}

      {loading ? (
        <View
          style={{
            position: "absolute",
            bottom: height * 0.48,
            alignSelf: "center",
          }}
        >
          <ActivityIndicator size={33} color={"rgb(255,140,0)"} />
        </View>
      ) : (
        <></>
      )}

      <StatusBar style="dark" hidden={true} />
    </SafeAreaView>
  );
}
const { height, width } = Dimensions.get("screen");
const styles = StyleSheet.create({
  pageText: {
    textAlign: "center",
    fontSize: 12,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    position: "absolute",
    bottom: 20,
    gap: 10,
    flexDirection: "row",
    width: width * 0.9,
    height: height * 0.1,
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
    elevation: 5,
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
