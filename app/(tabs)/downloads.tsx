import {
  View,
  Text,
  FlatList,
  useColorScheme,
  Animated,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { ThemedView } from "@/components/ThemedView";
import Styles, { height } from "@/constants/Styles";
import { PagerHeader } from "@/components/Headers";
import { useBookDownload } from "@/contexts/downloadContext";
import { DownloadsCard, QueueCard } from "@/components/Cards";
import CircularProgress from "react-native-circular-progress-indicator";
import { formattedSpeed, getSpeedUnit } from "@/api/q";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useBooks } from "@/contexts/booksContext";
import ToastManager from "toastify-react-native";
import { ThemedText } from "@/components/ThemedText";

const Downloads = () => {
  const downloadContext = useBookDownload();
  const booksContext = useBooks();
  const theme = useColorScheme() ?? "light";
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start fully visible
  const deletes = booksContext.selectedBooks.length > 0;
  useEffect(() => {
    if (downloadContext.speed <= 0) {
      // Fade out if speed is zero
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade in if speed is active
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [downloadContext.speed]);

  return (
    <ThemedView style={Styles.container}>
      <ToastManager
        duration={3500}
        height={50}
        width={320}
        textStyle={{ fontSize: 10 }}
        theme={theme}
      />
      {/* {downloadContext.isDownloading && (
        <ThemedView
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <CircularProgress
              value={Number(formattedSpeed(Number(downloadContext.speed)))}
              radius={80}
              duration={2000}
              progressValueColor={Colors[theme].text}
              maxValue={1024}
              activeStrokeColor={Colors.dark.icon}
              inActiveStrokeColor={Colors[theme].blur}
              title={getSpeedUnit(downloadContext.speed)}
              titleColor={Colors[theme].text}
              titleStyle={{ fontWeight: "bold" }}
            />
          </Animated.View>
        </ThemedView>
      )} */}

      <PagerHeader
        title={
          deletes
            ? `${booksContext.selectedBooks.length} Selected`
            : "Downloads"
        }
        leftIcon={deletes ? <AntDesign name="close" size={20} /> : null}
        leftIconAction={() => {
          booksContext.clearSelection();
        }}
        rightIcon={
          deletes ? (
            <Feather name="trash" size={20} />
          ) : booksContext.deleting ? (
            <ActivityIndicator size={20} color={Colors[theme].icon} />
          ) : null
        }
        rightIconAction={() => {
          booksContext.deleteSelectedBooks();
        }}
      />
      <ThemedView style={{ maxHeight: height * 0.83 }}>
        <FlatList
          data={downloadContext.downloadRecords}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponentStyle={{
            borderBottomWidth: 0.5,
            borderColor: "grey",
            paddingBottom: 10,
          }}
          ListHeaderComponent={
            downloadContext.queue.length > 0 ? (
              <>
                <ThemedText
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Downloading
                </ThemedText>
                {downloadContext.queue.map((item) => (
                  <QueueCard
                    authors={item.authors}
                    lang={item.lang}
                    download_size={item.download_size}
                    title={item.title}
                    book_url={item.book_url}
                    download_server={item.download_server}
                    pages={item.pages}
                    poster={item.poster}
                    publisher={item.publisher}
                    year={item.year}
                  />
                ))}
              </>
            ) : (
              <></>
            )
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <DownloadsCard
              router={router}
              Authors={item.Authors}
              Download_server={item.Download_server}
              Download_size={item.Download_size}
              FileUri={item.FileUri}
              Lang={item.Lang}
              Pages={item.Pages}
              Title={item.Title}
              Year={item.Year}
              Poster={item.Poster}
            />
          )}
          ListFooterComponent={() => <></>}
          contentContainerStyle={{ gap: 10 }}
          onEndReachedThreshold={0.7}
          onEndReached={async () => {}}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default Downloads;
