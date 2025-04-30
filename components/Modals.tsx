import {
  View,
  Modal,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "./ThemedView";
import { BlurView } from "expo-blur";
import { ModalProps, SearchResult } from "@/types";
import Styles, { height, width } from "@/constants/Styles";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { getBookDetails, sanitizeFileName } from "@/api/q";
import { useRouter } from "expo-router";
import { useBookDownload } from "@/contexts/downloadContext";

const SearchModal = ({ setModalVisibility, modalData }: ModalProps) => {
  const theme = useColorScheme() ?? "light";
  const [item, setItem] = useState<SearchResult>(modalData);
  const [desc, setDesc] = useState<string | undefined>("");
  const [loadingDesc, setLoadingDesc] = useState<boolean>(true);
  const downloadContext = useBookDownload();
  const isInDownload =
    downloadContext.downloadRecords.some(
      (it) => it.Title === sanitizeFileName(item.title)
    ) ||
    downloadContext.queue.some(
      (it) => sanitizeFileName(it.title) === sanitizeFileName(item.title)
    );
  const loadDesc = async () => {
    try {
      const result = await getBookDetails(item.book_url);
      setDesc(result.replaceAll(/\.([a-zA-Z])/g, ".\n$1"));
      setLoadingDesc(false);
    } catch (error) {
      setLoadingDesc(false);
    }
  };
  const close = () => {
    setModalVisibility(false);
  };
  const router = useRouter();
  useEffect(() => {
    loadDesc();
  }, [item]);
  return (
    <Modal
      animationType="fade"
      transparent
      onRequestClose={() => {
        setModalVisibility(false);
      }}
    >
      <BlurView
        style={Styles.centeredView}
        intensity={1}
        tint="systemThinMaterialLight"
        experimentalBlurMethod="dimezisBlurView"
      >
        <ThemedView style={Styles.modalContent}>
          {/* Header of modal */}
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderRadius: 20,
              paddingBottom: 5,
              alignItems: "center",
              paddingHorizontal: 15,
            }}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity style={{ alignSelf: "center" }} hitSlop={20}>
                <Ionicons
                  name="heart"
                  color={
                    theme == "light" ? Colors.light.icon : Colors.dark.text
                  }
                  size={18}
                />
              </TouchableOpacity>
              <View
                style={{
                  height: height * 0.05,
                  borderTopRightRadius: 3,
                  width: "auto",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="bookmark"
                  color={
                    theme == "light" ? Colors.light.icon : Colors.dark.text
                  }
                  size={18}
                />
              </View>
            </View>
            <ThemedText
              style={{
                alignSelf: "center",
                color: theme == "light" ? Colors.light.icon : Colors.dark.text,
                fontWeight: "600",
              }}
            >
              Description
            </ThemedText>
            {loadingDesc ? (
              <ActivityIndicator
                color={theme == "light" ? Colors.light.icon : Colors.dark.text}
              />
            ) : (
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                hitSlop={20}
                onPress={() => {
                  setModalVisibility(false);
                  router.push({
                    pathname: "/others/details",
                    params: { desc: desc?.toString(), ...item },
                  });
                }}
              >
                <Ionicons
                  name="expand"
                  color={
                    theme == "light" ? Colors.light.icon : Colors.dark.text
                  }
                  size={18}
                />
              </TouchableOpacity>
            )}
          </ThemedView>
          {/* Body of modal */}
          <ScrollView
            style={{
              backgroundColor: Colors[theme].blur,
              maxWidth: width * 0.9,
              minWidth: width * 0.8,
              alignSelf: "center",
              borderRadius: 12,
              height: height * 0.35,
              maxHeight: height * 0.3,
              minHeight: height * 0.2,
            }}
          >
            {item ? (
              <>
                <ThemedView
                  style={{
                    flexDirection: "row",
                    backgroundColor: "transparent",
                    gap: 5,
                    borderBottomWidth: 0.5,
                    paddingBottom: 5,
                    borderColor: "grey",
                  }}
                >
                  <Image
                    source={{
                      uri: item.poster,
                    }}
                    style={{
                      height: height * 0.1,
                      width: "23%",
                      borderTopLeftRadius: 12,
                    }}
                    placeholder={require("@/assets/images/pdf.png")}
                    contentFit="cover"
                  />
                  <ThemedText style={Styles.modalBodyText} numberOfLines={5}>
                    {item.title}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={Styles.modalBodyContainer}>
                  <ThemedText
                    style={{
                      fontSize: 9,
                      fontWeight: "bold",
                    }}
                  >
                    Author(s) :
                  </ThemedText>
                  <ThemedText style={Styles.modalBodyText}>
                    {item.authors}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={Styles.modalBodyContainer}>
                  <ThemedText
                    style={{
                      fontSize: 9,
                      fontWeight: "bold",
                    }}
                  >
                    Publisher(s) :
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 9,
                      width: width * 0.6,
                      lineHeight: 14,
                      fontWeight: "bold",
                      opacity: 0.5,
                    }}
                  >
                    {item.publisher || "Unkown publishers"}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={Styles.modalBodyContainer}>
                  <ThemedText
                    style={{
                      fontSize: 9,
                      fontWeight: "bold",
                    }}
                  >
                    Languages(s) :
                  </ThemedText>
                  <ThemedText style={Styles.modalBodyText}>
                    {item.lang || "Not specified"}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={Styles.modalBodyContainer}>
                  <ThemedText
                    style={{
                      fontSize: 9,
                      fontWeight: "bold",
                    }}
                  >
                    Pages :
                  </ThemedText>
                  <ThemedText style={Styles.modalBodyText}>
                    {item.pages || "Not specified"}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={Styles.modalBodyContainer}>
                  <ThemedText
                    style={{
                      fontSize: 9,
                      fontWeight: "bold",
                    }}
                  >
                    Year :
                  </ThemedText>
                  <ThemedText style={Styles.modalBodyText}>
                    {item.year || "Not specified"}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={Styles.modalBodyContainer}>
                  <ThemedText
                    style={{
                      fontSize: 9,
                      lineHeight: 14,
                      fontWeight: "bold",
                      textAlign: "center",
                      alignSelf: "center",
                      flex: 1,
                      opacity: 0.5,
                    }}
                  >
                    Book description
                  </ThemedText>
                </ThemedView>
                {loadingDesc ? (
                  <ActivityIndicator color={Colors[theme].icon} />
                ) : (
                  <ThemedView style={Styles.modalBodyContainer}>
                    <ThemedText style={Styles.modalBodyText}>
                      {desc || "Not specified"}
                    </ThemedText>
                  </ThemedView>
                )}
              </>
            ) : (
              <ActivityIndicator color={Colors[theme].icon} />
            )}
          </ScrollView>
          {/* Footer of modal */}
          <ThemedView
            style={{
              marginTop: 5,
              maxWidth: width * 0.9,
              minWidth: width * 0.8,
              height: height * 0.06,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 5,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={[
                Styles.modalButton,
                { backgroundColor: Colors.light.icon },
              ]}
            >
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: Colors.dark.text,
                }}
              >
                Add to bookmark
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                Styles.modalButton,
                {
                  backgroundColor: Colors.dark.icon,
                  opacity: isInDownload ? 0.5 : 1,
                },
              ]}
              onPress={() => {
                if (isInDownload) return;
                const { setModalVisibility, setModalData, ...newItem } = item;
                downloadContext.addToQueue(newItem);
                close();
              }}
            >
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: Colors.dark.text,
                }}
              >
                {isInDownload ? "Downloaded" : "Free Download"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </BlurView>
    </Modal>
  );
};

export default SearchModal;
