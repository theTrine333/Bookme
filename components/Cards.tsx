import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { DownloadCardProps, SearchResult } from "@/types";
import { Colors } from "@/constants/Colors";
import { height, width } from "@/constants/Styles";
import * as Progress from "react-native-progress";
import { Image } from "expo-image";
import blurhash from "@/constants/blurhash";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import {
  formattedTime,
  getSpeedUnit,
  sanitizeFileName,
  unsanitizeFileName,
} from "@/api/q";
import { useBookDownload } from "@/contexts/downloadContext";

const ResultCard = ({
  authors,
  download_size,
  book_url,
  lang,
  pages,
  poster,
  publisher,
  title,
  year,
  setModalVisibility,
  setModalData,
  download_server,
}: SearchResult) => {
  const theme = useColorScheme() ?? "light";
  const downloadContext = useBookDownload();
  const isDownloading =
    downloadContext.currentBook &&
    sanitizeFileName(downloadContext.currentBook.title) ===
      sanitizeFileName(title);
  const isInDownload =
    downloadContext.downloadRecords.some(
      (item) => item.Title === sanitizeFileName(title)
    ) ||
    downloadContext.queue.some(
      (item) => sanitizeFileName(item.title) === sanitizeFileName(title)
    );
  // console.log(download_server, isInDownload);

  return (
    <TouchableOpacity
      onPress={async () => {
        if (!isInDownload) {
          setModalData({
            poster: poster,
            authors: authors,
            publisher: publisher,
            title: title,
            year: year,
            lang: lang,
            book_url: book_url,
            pages: pages,
            download_size: download_size,
            download_server: download_server,
          });
          setModalVisibility(true);
        }
      }}
      style={{
        backgroundColor: Colors[theme].blur,
        height: height * 0.13,
        borderRadius: 12,
        flexDirection: "row",
      }}
    >
      <Image
        source={{
          uri: poster,
        }}
        style={{
          height: "100%",
          width: "23%",
          borderBottomLeftRadius: 12,
          borderTopLeftRadius: 12,
        }}
        placeholder={require("@/assets/images/pdf.png")}
        contentFit="cover"
      />
      <ThemedView
        style={{
          flex: 1,
          backgroundColor: "transparent",
          paddingHorizontal: 5,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            borderBottomWidth: 0.5,
            marginLeft: 5,
            paddingBottom: 3,
            borderColor: "grey",
            // alignItems: "center",
            width: "100%",
          }}
        >
          <ThemedText
            style={{
              fontSize: 11,
              width: "80%",
              paddingTop: 5,
              lineHeight: 17,
              paddingLeft: 3,
            }}
            numberOfLines={2}
          >
            {title}
          </ThemedText>

          <View style={{ flexDirection: "row", gap: 5 }}>
            <View
              style={{
                height: height * 0.05,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="heart"
                color={theme == "light" ? Colors.light.icon : Colors.light.blur}
                size={18}
              />
            </View>
            <View
              style={{
                backgroundColor:
                  theme == "light" ? Colors.light.icon : Colors.light.blur,
                height: height * 0.05,
                borderTopRightRadius: 12,
                width: "auto",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="bookmark" color={"white"} size={18} />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: isDownloading ? 0 : 0.5,
            alignItems: "center",
            borderColor: "grey",
            marginLeft: 5,
            paddingTop: isDownloading ? 10 : 0,
            width: "100%",
            paddingRight: 5,
            justifyContent: "space-between",
          }}
        >
          {isDownloading ? (
            <>
              <Progress.Bar
                width={width * 0.65}
                color={Colors[theme].icon}
                borderColor={Colors[theme].icon}
                progress={Number(downloadContext.progress.toFixed(2))}
              />
            </>
          ) : (
            <>
              <ThemedText
                style={{
                  paddingLeft: 10,
                  fontSize: 10,
                  color: "grey",
                  maxWidth: "75%",
                  borderColor: "white",
                }}
                numberOfLines={1}
              >
                {authors + " " || "Unkown authors"}
              </ThemedText>
              <ThemedText
                style={{ fontSize: 9, color: "grey", fontWeight: "700" }}
              >
                {year}
              </ThemedText>
            </>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            marginLeft: 5,
            width: "100%",
            flex: 1,
            borderBottomRightRadius: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Download speed */}
          {isDownloading ? (
            <>
              <ThemedText
                style={{
                  paddingLeft: 10,
                  fontSize: 10,
                  maxWidth: "75%",
                  borderColor: "white",
                }}
                numberOfLines={1}
              >
                {downloadContext.speed +
                  " " +
                  getSpeedUnit(downloadContext.speed)}
              </ThemedText>
              {/* Percentage */}
              <ThemedText
                style={{
                  paddingLeft: 10,
                  fontSize: 10,
                  color: "grey",
                  maxWidth: "75%",
                  borderColor: "white",
                }}
                numberOfLines={1}
              >
                {(downloadContext.progress * 100).toFixed(2) + "%" || "0%"}
              </ThemedText>
              {/* Time left */}
              <ThemedText
                style={{
                  paddingRight: 10,
                  fontSize: 10,
                  borderColor: "white",
                }}
                numberOfLines={1}
              >
                Time left : {formattedTime(downloadContext.timeLeftCurrent)}
              </ThemedText>
            </>
          ) : (
            <ThemedText
              style={{
                paddingLeft: 10,
                fontSize: 10,
                color: "grey",
                maxWidth: "75%",
                borderColor: "white",
              }}
              numberOfLines={1}
            >
              Lang : {lang || "Unkown"}
            </ThemedText>
          )}

          {!isInDownload && (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.dark.icon,
                height: "80%",
                alignSelf: "flex-end",
                borderBottomRightRadius: 12,
              }}
              onPress={() => {
                downloadContext.addToQueue({
                  authors: authors,
                  poster: poster,
                  book_url: book_url,
                  download_server: download_server,
                  download_size: download_size,
                  lang: lang,
                  pages: pages,
                  title: title,
                  publisher: publisher,
                  year: year,
                });
              }}
            >
              <ThemedText style={{ fontSize: 11, paddingHorizontal: 10 }}>
                Free download
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

export const DownloadsCard = ({
  Authors,
  FileUri,
  Download_server,
  Download_size,
  Lang,
  Pages,
  Title,
  Year,
  Poster,
  router,
}: DownloadCardProps) => {
  const theme = useColorScheme() ?? "light";
  return (
    <TouchableOpacity
      onPress={async () => {
        router.push({
          pathname: "/others",
          params: {
            book_url: FileUri,
            download_server: Download_server,
            title: Title,
          },
        });
      }}
      style={{
        backgroundColor: Colors[theme].blur,
        height: height * 0.13,
        borderRadius: 12,
        flexDirection: "row",
      }}
    >
      <Image
        source={{
          uri: Poster,
        }}
        style={{
          height: "100%",
          width: "23%",
          borderBottomLeftRadius: 12,
          borderTopLeftRadius: 12,
        }}
        placeholder={require("@/assets/images/pdf.png")}
        contentFit="cover"
      />
      <ThemedView
        style={{
          flex: 1,
          backgroundColor: "transparent",
          paddingHorizontal: 5,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            borderBottomWidth: 0.5,
            marginLeft: 5,
            paddingBottom: 3,
            borderColor: "grey",
            // alignItems: "center",
            width: "100%",
          }}
        >
          <ThemedText
            style={{
              fontSize: 11,
              width: "80%",
              paddingTop: 5,
              lineHeight: 17,
              paddingLeft: 3,
            }}
            numberOfLines={2}
          >
            {unsanitizeFileName(Title)}
          </ThemedText>

          <View style={{ flexDirection: "row", gap: 5 }}>
            <View
              style={{
                height: height * 0.05,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="heart"
                color={theme == "light" ? Colors.light.icon : Colors.light.blur}
                size={18}
              />
            </View>
            <View
              style={{
                backgroundColor:
                  theme == "light" ? Colors.light.icon : Colors.light.blur,
                height: height * 0.05,
                borderTopRightRadius: 12,
                width: "auto",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="bookmark" color={"white"} size={18} />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 0.5,
            borderColor: "grey",
            marginLeft: 5,
            width: "100%",
            paddingRight: 5,
            justifyContent: "space-between",
          }}
        >
          <ThemedText
            style={{
              paddingLeft: 10,
              fontSize: 10,
              color: "grey",
              maxWidth: "75%",
              borderColor: "white",
            }}
            numberOfLines={1}
          >
            {Authors + " " || "Unkown authors"}
          </ThemedText>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginLeft: 5,
            width: "100%",
            flex: 1,
            paddingRight: 10,
            borderBottomRightRadius: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText
            style={{
              paddingLeft: 10,
              fontSize: 10,
              color: "grey",
              maxWidth: "75%",
              borderColor: "white",
            }}
            numberOfLines={1}
          >
            Lang : {Lang || "Unkown"}
          </ThemedText>

          <ThemedText
            style={{
              fontSize: 9,
              color: "grey",
              fontWeight: "700",
            }}
          >
            {Download_size}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default ResultCard;
