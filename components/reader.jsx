import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Button,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import Pdf from "react-native-pdf";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TextInput } from "react-native";
export default function Reader({ navigation, route }) {
  const book_url = route.params.bookUrl;
  const onlineSource = { uri: `${book_url}`, cache: true };
  const [pdfSource, setPdfSource] = useState(onlineSource);
  const pdfRef = useRef();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState("0");
  const [pageText, setpageText] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
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
                  justifyContent: "center",
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

            <TouchableOpacity
              style={[
                styles.modalSubView,
                { alignSelf: "center", padding: 10 },
              ]}
            >
              <Text style={styles.modalText}>Save</Text>
              <AntDesign
                name="clouddownloado"
                size={25}
                style={{ marginTop: 2 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalSubView,
                { alignSelf: "center", padding: 10 },
              ]}
            >
              <Text style={styles.modalText}>Share</Text>
              <AntDesign name="sharealt" size={25} style={{ marginTop: 2 }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignSelf: "center", padding: 10 }}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <AntDesign
                name="closecircleo"
                size={25}
                style={{ marginTop: 2 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Pdf
        trustAllCerts={false}
        ref={pdfRef}
        page={Number(pageText)}
        source={pdfSource}
        onLoadComplete={(numberOfPages, filePath) => {
          setTotalPages(numberOfPages);
        }}
        onPageChanged={(page, numberOfPages) => {
          setCurrentPage(`${page}`);
        }}
        enableDoubleTapZoom={true}
        enablePaging={false}
        onError={(error) => {
          console.log(error);
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
          paddingVertical: 15,
          paddingHorizontal: 15,
          borderBottomLeftRadius: 8,
          borderTopRightRadius: 8,
          bottom: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          flex: 1,
          gap: 10,
          flexDirection: "row",
          shadowRadius: 4,
          elevation: 1,
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
    backgroundColor: "#fff",
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
    width: width * 0.8,
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
