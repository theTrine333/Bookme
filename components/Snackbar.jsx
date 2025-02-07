import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { height, width } from "./bookCard";
import { Pie } from "react-native-progress";
import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import {
  extractFileNameFromUrl,
  formatFileSize,
  readFileInChunks,
  writeChunksToFile,
} from "../api/database";

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
  const [snackState, setSnackState] = useState();
  const [exportName, setExportName] = useState("");
  let totalSize = 0;
  const [totalFilesSizes, setTotalFileSizes] = useState(totalSize);
  const exportBooks = async () => {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      console.log("User didn't grant permissions");
      return;
    }
    const CHUNK_SIZE = 10 * 1024 * 1024;
    const processFileInChunks = async (sourceUri, destinationUri) => {
      const fileInfo = await FileSystem.getInfoAsync(sourceUri);
      const fileSize = fileInfo.size;

      let offset = 0;
      const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        // Read the file as binary data (instead of base64) using a raw binary string
        const chunk = await FileSystem.readAsStringAsync(sourceUri, {
          encoding: FileSystem.EncodingType.Base64, // Keep base64 encoding for PDF files
          length: CHUNK_SIZE,
          position: offset,
        });

        offset += CHUNK_SIZE;

        await FileSystem.StorageAccessFramework.writeAsStringAsync(
          destinationUri,
          chunk,
          { encoding: FileSystem.EncodingType.Base64, append: chunkIndex > 0 }
        );

        const progress = Math.round((offset / fileSize) * 100);
        console.log(`Progress: ${progress}%`);
      }

      console.log("File processing complete.");
    };

    // Iterate over the exports and process each file
    exports.forEach(async (element) => {
      const sourceUri = element.bookUrl;
      setExportName(extractFileNameFromUrl(sourceUri));
      const destinationFolder = permissions.directoryUri;
      const fileName = extractFileNameFromUrl(element.bookUrl);

      try {
        const destinationUri =
          await FileSystem.StorageAccessFramework.createFileAsync(
            destinationFolder,
            fileName,
            "application/pdf"
          );

        // Process the file in chunks and write it to the destination
        await processFileInChunks(sourceUri, destinationUri);

        Alert.alert("Done", `File ${fileName} successfully exported.`);
      } catch (e) {
        console.info(
          "Error",
          `Error exporting file ${element.bookUrl}: ${e.message}`
        );
        Alert.alert("Error", `Error exporting file: ${e.message}`);
      }
    });
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
          {exportName}
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
