import { View, Text, FlatList, useColorScheme, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { ThemedView } from "@/components/ThemedView";
import Styles, { height } from "@/constants/Styles";
import { PagerHeader } from "@/components/Headers";
import { useBookDownload } from "@/contexts/downloadContext";
import ResultCard, { DownloadsCard } from "@/components/Cards";
import CircularProgress from "react-native-circular-progress-indicator";
import { formattedSpeed, getSpeedUnit } from "@/api/q";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const Downloads = () => {
  const downloadContext = useBookDownload();
  const theme = useColorScheme() ?? "light";
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start fully visible

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
      {downloadContext.isDownloading && (
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
      )}

      <PagerHeader title={"Downloads"} />
      <ThemedView style={{ maxHeight: height * 0.83 }}>
        <FlatList
          data={downloadContext.downloadRecords}
          keyExtractor={(_, index) => index.toString()}
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
