import {
  View,
  Text,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import Styles, { height, width } from "@/constants/Styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ThemedText } from "@/components/ThemedText";
import { extractLink, sanitizeFileName } from "@/api/q";
import { detailsParamsProps } from "@/types";
import { useBookDownload } from "@/contexts/downloadContext";

const Details = () => {
  const parama: detailsParamsProps = useLocalSearchParams();
  const router = useRouter();
  const downloadContext = useBookDownload();
  const isDownloading = parama.title === downloadContext.currentBook?.title;
  const isInDownload =
    downloadContext.downloadRecords.some(
      (item) => item.Title === sanitizeFileName(parama.title)
    ) ||
    downloadContext.queue.some(
      (item) => sanitizeFileName(item.title) === sanitizeFileName(parama.title)
    );
  const theme = useColorScheme() ?? "light";
  const [link, setLink] = useState<any>("");
  const [state, setState] = useState<
    "idle" | "loading" | "reading" | "downloading" | "error"
  >("loading");
  const getLink = async () => {
    setState("loading");
    try {
      let url = parama.download_server;
      const res = await extractLink(url);
      setLink(res);
      setState("idle");
    } catch (error) {
      setState("error");
    }
  };
  useEffect(() => {
    getLink();
  }, []);
  return (
    <ThemedView style={{ flex: 1 }}>
      <Image
        style={Styles.genreImage}
        source={parama?.poster}
        placeholder={require("@/assets/images/pdf.png")}
        contentFit="cover"
        transition={1000}
      />
      <LinearGradient
        colors={["transparent", Colors[theme].background]}
        style={Styles.genreGradient}
      />
      <ThemedView
        style={{
          backgroundColor: Colors[theme].blur,
          borderColor: "white",
          width: width * 0.95,
          marginTop: -50,
          minHeight: height * 0.1,
          borderRadius: 12,
          alignSelf: "center",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <ThemedText style={Styles.modalBodyText} numberOfLines={4}>
          {parama.title}
        </ThemedText>
        {/* More about the books */}
        <ThemedView
          style={{
            width: width * 0.9,
            minHeight: height * 0.08,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            marginTop: 10,
          }}
        >
          <ThemedText
            style={[
              Styles.modalBodyText,
              { alignSelf: "center", textAlign: "center" },
            ]}
          >
            Author(s)
          </ThemedText>
          <ThemedText
            style={[
              Styles.modalBodyText,
              { alignSelf: "center", textAlign: "center", opacity: 0.5 },
            ]}
            numberOfLines={2}
          >
            {parama.authors}
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            width: width * 0.9,
            minHeight: height * 0.08,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 12,
            marginTop: 10,
          }}
        >
          <ThemedView
            style={{
              alignItems: "center",
              justifyContent: "center",
              maxWidth: width * 0.3,
              height: height * 0.06,
            }}
          >
            <ThemedText style={[Styles.modalBodyText, { textAlign: "center" }]}>
              Language
            </ThemedText>
            <ThemedText
              style={[
                Styles.modalBodyText,
                { textAlign: "center", opacity: 0.5 },
              ]}
              numberOfLines={1}
            >
              {parama.lang || "Null"}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRightWidth: 1,
              borderLeftWidth: 1,
              maxWidth: width * 0.3,
              maxHeight: height * 0.06,
              borderColor: "grey",
            }}
          >
            <ThemedText style={[Styles.modalBodyText, { textAlign: "center" }]}>
              Year
            </ThemedText>
            <ThemedText
              style={[
                Styles.modalBodyText,
                { textAlign: "center", opacity: 0.5 },
              ]}
              numberOfLines={1}
            >
              {parama.year || "Null"}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={{
              alignItems: "center",
              justifyContent: "center",
              maxWidth: width * 0.3,
              height: height * 0.06,
            }}
          >
            <ThemedText style={[Styles.modalBodyText, { textAlign: "center" }]}>
              Pages
            </ThemedText>
            <ThemedText
              style={[
                Styles.modalBodyText,
                { textAlign: "center", opacity: 0.5 },
              ]}
              numberOfLines={1}
            >
              {parama.pages || "Null"}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        {/* <ThemedView
          style={{
            width: width * 0.9,
            minHeight: height * 0.08,
            borderRadius: 12,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <ThemedText
            style={[
              Styles.modalBodyText,
              {
                borderBottomWidth: 0.5,
                alignSelf: "center",
                textAlign: "center",
                paddingBottom: 10,
                marginBottom: 10,
              },
            ]}
          >
            Publishers
          </ThemedText>
          <ThemedText
            style={[
              Styles.modalBodyText,
              { textAlign: "center", opacity: 0.5 },
            ]}
          >
            {parama.publisher || "Unkown publishers"}
          </ThemedText>
        </ThemedView> */}
        <ScrollView
          style={{
            width: width * 0.9,
            minHeight: height * 0.06,
            maxHeight: height * 0.25,
            borderRadius: 12,
            padding: 10,
            backgroundColor: Colors[theme].background,
            marginTop: 10,
          }}
        >
          <ThemedText
            style={[
              Styles.modalBodyText,
              {
                borderBottomWidth: 0.5,
                alignSelf: "center",
                textAlign: "center",
                paddingBottom: 10,
                marginBottom: 10,
              },
            ]}
          >
            Description
          </ThemedText>
          <ThemedText
            style={[
              Styles.modalBodyText,
              parama.desc.toString().trim().length == 0 && {
                textAlign: "center",
                alignSelf: "center",
              },
              { opacity: 0.5 },
            ]}
          >
            {parama.desc.toString().replaceAll(/\.([a-zA-Z])/g, ".\n$1") ||
              "No descriptions yet"}
          </ThemedText>
        </ScrollView>
      </ThemedView>
      <ThemedView
        style={{
          backgroundColor: Colors[theme].blur,
          flexDirection: "row",
          justifyContent: "space-around",
          width: width * 0.95,
          height: height * 0.08,
          borderRadius: 12,
          marginTop: 5,
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        {state == "loading" ? (
          <ActivityIndicator color={Colors[theme].icon} />
        ) : (
          <>
            <TouchableOpacity
              style={[
                Styles.downloadBtn,
                {
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: Colors[theme].icon,
                  opacity: state == "error" || state == "reading" ? 0.5 : 1,
                },
              ]}
              onPress={() => {
                setState("reading");
                const { __EXPO_ROUTER_key, book_url, desc, ...newData } =
                  parama;
                router.push({
                  pathname: "/others",
                  params: { book_url: link, ...newData },
                });
                setState("idle");
              }}
              disabled={state == "error" || state == "reading"}
            >
              {state == "reading" ? (
                <ActivityIndicator color={Colors[theme].icon} />
              ) : (
                <ThemedText
                  style={[
                    Styles.modalBodyText,
                    {
                      textAlign: "center",
                      fontSize: 14,
                      color: Colors[theme].icon,
                    },
                  ]}
                >
                  Read online
                </ThemedText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                Styles.downloadBtn,
                {
                  opacity:
                    state == "error" ||
                    isInDownload ||
                    isDownloading ||
                    state == "downloading"
                      ? 0.5
                      : 1,
                },
              ]}
              onPress={() => {
                setState("downloading");
                const { __EXPO_ROUTER_key, ...newParams } = parama;
                downloadContext.addToQueue({ ...newParams, publisher: "" });
                setTimeout(() => {
                  setState("idle");
                }, 1000);
              }}
              disabled={
                state == "error" ||
                isInDownload ||
                isDownloading ||
                state == "downloading"
              }
            >
              {state == "downloading" ? (
                <ActivityIndicator color={Colors.dark.text} />
              ) : (
                <ThemedText
                  style={[
                    Styles.modalBodyText,
                    {
                      color: Colors.dark.text,
                      textAlign: "center",
                      fontSize: 14,
                    },
                  ]}
                >
                  {isDownloading
                    ? `Downloading..${(downloadContext.progress * 100).toFixed(
                        1
                      )}%`
                    : isInDownload
                    ? "Downloaded"
                    : "Download"}
                </ThemedText>
              )}
            </TouchableOpacity>
          </>
        )}
      </ThemedView>
      <StatusBar hidden />
    </ThemedView>
  );
};

export default Details;
