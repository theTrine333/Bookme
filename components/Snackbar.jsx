import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { height, width } from "./bookCard";
import { Pie } from "react-native-progress";
import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import { extractFileNameFromUrl, formatFileSize } from "../api/database";

async function getFileSize(filePath) {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      return fileInfo.size;
    } else {
      return 0;
    }
  } catch (error) {
    return 0;
  }
}

const Snackbar = ({ setShown, exports }) => {
  const dispatch = useDispatch();
  let totalSize = 0;
  const [totalFilesSizes, setTotalFileSizes] = useState(totalSize);
  const [downlaodProgress, setDownloadProgress] = useState(0);
  const exportBooks = async () => {
    try {
      // Request storage permissions
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        console.log("User did not grant storage permissions");
        return;
      }
      const downloadsPath = permissions.directoryUri; // Directory URI for storage
      const existingFiles =
        await FileSystem.StorageAccessFramework.readDirectoryAsync(
          downloadsPath
        );
      exports.forEach(async (book) => {
        try {
          const title = extractFileNameFromUrl(book.bookUrl);
          const filePath = `${downloadsPath}/${title}`;

          // Check if the file already exists
          if (existingFiles.includes(filePath)) {
            console.log(`Download skipped: ${title} already exists.`);
            return;
          }

          // Start the download
          const downloadResumable = FileSystem.createDownloadResumable(
            book.bookUrl,
            FileSystem.documentDirectory + title, // Temporary storage
            {},
            (downloadProgress) => {
              const progressPercentage =
                downloadProgress.totalBytesWritten /
                downloadProgress.totalBytesExpectedToWrite;
              console.log("Progress: ", progressPercentage);
            }
          );

          // Download the file
          const { uri } = await downloadResumable.downloadAsync();

          // Move the file to the selected directory
          await FileSystem.StorageAccessFramework.createFileAsync(
            downloadsPath,
            title,
            "application/pdf"
          ).then(async (uri) => {
            await FileSystem.copyAsync({
              from: uri,
              to: uri,
            });
            console.log(`File saved to: ${uri}`);
          });
        } catch (error) {
          console.error("Error downloading file:", error);
        }
      });
    } catch (error) {
      console.error("Error accessing storage:", error);
    }
  };
  useEffect(() => {
    exportBooks();
  }, []);
  useEffect(() => {
    if (exports.length === 0) {
      setShown(false);
      return;
    }
    totalSize = 0;
    exports.forEach(async (element) => {
      await getFileSize(element.bookUrl).then((e) => {
        totalSize += e;
        setTotalFileSizes(totalSize);
      });
    });
  }, [exports]);

  //   const selector = useSelector((state) => state.books.books);
  return (
    <View style={styles.snackContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.snackText}>
          Exporting...{formatFileSize(totalFilesSizes)}
        </Text>
        <Text style={styles.snackBodyText} numberOfLines={1}>
          Java Programming
        </Text>
      </View>
      <Pie
        size={30}
        style={styles.snackPie}
        progress={0.5}
        indeterminate={true}
        color="#FF5722"
      />
    </View>
  );
};

export default Snackbar;

const styles = StyleSheet.create({
  snackContainer: {
    elevation: 4,
    backgroundColor: "lightgrey",
    flexDirection: "row",
    borderRadius: 8,
    alignSelf: "center",
    height: height * 0.06,
    marginHorizontal: 10,
    marginVertical: 7,
    justifyContent: "space-between",
    padding: 10,
    minWidth: width * 0.95,
  },
  snackText: {
    fontWeight: "bold",
    fontSize: 11,
  },
  snackBodyText: {
    fontSize: 10,
    color: "#FF5722",
  },
  textContainer: {
    width: width * 0.8,
    justifyContent: "center",
  },
  snackPie: { alignSelf: "center" },
});
