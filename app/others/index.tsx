import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Share,
  useColorScheme,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { readerParamsProps } from "@/types";
import Pdf from "react-native-pdf";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { height, width } from "@/constants/Styles";
import { AntDesign, FontAwesome6, SimpleLineIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import { Colors } from "@/constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useBooks } from "@/contexts/booksContext";
const Index = () => {
  const params: readerParamsProps = useLocalSearchParams();
  const source = { uri: `${params.book_url}` };
  const [pdfSource, setPdfSource] = useState(source);
  const pdfRef = useRef();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState("0");
  const [pageText, setpageText] = useState(1);
  const [tempPage, setTempPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downlaoding, setDownload] = useState(false);
  const [horizontalView, setHorizontalView] = useState(false);
  const [pageView, setPageView] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const theme = useColorScheme() ?? "light";
  const db = useSQLiteContext();
  const context = useBooks();
  if (!params.download_server) {
    return <ActivityIndicator />;
  }

  const rememberPage = () => {
    let page = context.getPage(params.title);
    setCurrentPage(`${page}`);
  };

  const updatedReadPage = async (page: string) => {
    context.savePage(params.title, Number(page));
  };

  function checkUrl(url: string) {
    if (url.startsWith("https://")) {
      return true;
    } else if (url.startsWith("file://")) {
      return false;
    }
    return null;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: Colors[theme].background }]}
    >
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
                  onChangeText={(text: string) => {
                    let tempPage = currentPage;
                    if (Number(text) <= totalPages) {
                      setTempPage(Number(text));
                    } else {
                      setTempPage(Number(tempPage));
                    }
                  }}
                  onSubmitEditing={() => {
                    setpageText(tempPage);
                    setModalVisible(false);
                  }}
                />
                <Text style={{ fontSize: 12 }}>/{totalPages}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.modalSubView,
                { alignSelf: "center", padding: 10, alignItems: "center" },
              ]}
              onPress={() => setHorizontalView(!horizontalView)}
            >
              {horizontalView ? (
                <Text style={styles.modalText}>Vertical</Text>
              ) : (
                <Text style={styles.modalText}>Horizontal</Text>
              )}
              <View>
                {horizontalView ? (
                  <FontAwesome6
                    name="arrow-down-short-wide"
                    size={24}
                    color="black"
                  />
                ) : (
                  <FontAwesome6
                    name="arrow-right-arrow-left"
                    size={24}
                    color="black"
                  />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalSubView,
                { alignSelf: "center", padding: 10, alignItems: "center" },
              ]}
              onPress={() => setPageView(!pageView)}
            >
              {pageView ? (
                <Text style={styles.modalText}> Fill View</Text>
              ) : (
                <Text style={styles.modalText}> Fit View</Text>
              )}
              <View>
                {pageView ? (
                  <SimpleLineIcons
                    name="size-fullscreen"
                    size={24}
                    color="black"
                  />
                ) : (
                  <SimpleLineIcons name="size-actual" size={24} color="black" />
                )}
              </View>
              {/* <Switch value={pageView} onValueChange={setPageView} /> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalSubView,
                { alignSelf: "center", padding: 10 },
              ]}
              onPress={async () => {
                if (isFile) {
                  Share.share({
                    message: `Check out this book ${params.title} at ${params.book_url} downloaded by Bookme app`,
                    title: "Share Bookme",
                  });
                } else {
                  Sharing.shareAsync(params.book_url);
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
          source={require("@/assets/images/no-internet.png")}
          style={{
            height: 180,
            width: 180,
            alignSelf: "center",
            position: "absolute",
            backgroundColor: Colors.light.background,
            bottom: height * 0.4,
            borderRadius: 12,
          }}
        />
      ) : (
        <>
          <Pdf
            trustAllCerts={false}
            page={Number(pageText)}
            source={pdfSource}
            onLoadProgress={(progress) => {}}
            onLoadComplete={(
              numberOfPages: number,
              path: string,
              size: { height: number; width: number },
              tableContents
            ) => {
              Alert.alert("Load completed");
            }}
            onPageChanged={(page, numberOfPages) => {
              setCurrentPage(`${page}`);
              setTotalPages(numberOfPages);

              // updatedReadPage(`${page}`);
            }}
            enableDoubleTapZoom={true}
            enablePaging={pageView}
            horizontal={horizontalView}
            onError={(error) => {
              // console.log(params.book_url, error);
              setError(true);
              setLoading(false);
            }}
            onPressLink={async (uri) => {
              await WebBrowser.openBrowserAsync(uri);
            }}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: Colors.light.background },
            ]}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              alignSelf: "center",
              height: height * 0.06,
              width: width * 0.25,
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
    </View>
  );
};

export default Index;
const styles = StyleSheet.create({
  pageText: {
    textAlign: "center",
    fontSize: 12,
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.light.background,
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
