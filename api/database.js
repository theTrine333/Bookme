import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addToBeExported, clearToBeDeleted } from "../store/slicer";

export const exportDatabase = async () => {
  try {
    const dbName = "bookme.db";
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
    if (!fileInfo.exists) {
      Alert.alert("Error", "No database to be exported");
      return;
    }

    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!permissions.granted) {
      Alert.alert("Error", "User didn't grant storage permissions");
      return;
    }

    // Get the URI of the selected directory
    const directoryUri = permissions.directoryUri;

    // Create file in selected directory
    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      directoryUri,
      dbName,
      "application/vnd.sqlite3"
    );

    // Write database content to the created file
    const dbContent = await FileSystem.readAsStringAsync(dbFilePath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await FileSystem.StorageAccessFramework.writeAsStringAsync(
      fileUri,
      dbContent,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );

    // Copy the file to a shareable local directory
    const localFilePath = `${FileSystem.cacheDirectory}${dbName}`;
    await FileSystem.copyAsync({
      from: fileUri,
      to: localFilePath,
    });

    // Offer sharing if supported
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localFilePath);
    }
  } catch (error) {
    Alert.alert("Error exporting database:", error);
  }
};

export const shareBooks = async (books, dispatch) => {
  if (await Sharing.isAvailableAsync()) {
    books.forEach(async (element) => {
      try {
        await Sharing.shareAsync(element.bookUrl);
      } catch {}
    });
  }
};
export const exportBooks = async (books, dispatch) => {
  // const permissions =
  //   await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  // if (!permissions.granted) {
  //   // Alert.alert("Error", "User didn't grant storage permissions");
  //   dispatch(clearToBeDeleted());
  //   return;
  // }
  // // Get the URI of the selected directory
  // const directoryUri = permissions.directoryUri;
  books?.forEach(async (element) => {
    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      directoryUri,
      extractFileNameFromUrl(element.bookUrl),
      "application/pdf"
    );
    const dbContent = await FileSystem.readAsStringAsync(element.bookUrl, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await FileSystem.StorageAccessFramework.writeAsStringAsync(
      fileUri,
      dbContent,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );
  });
};

export function extractFileNameFromUrl(url) {
  try {
    const fileUrl = new URL(url);
    const filePath = fileUrl.pathname;
    const fileName = filePath.split("/").pop();
    return fileName;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes"; // Handle zero bytes case

  const k = 1024; // Factor for kilobytes
  const dm = decimals < 0 ? 0 : decimals; // Ensure decimals is non-negative
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]; // Units

  // Determine the appropriate unit based on the size of the file
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Calculate the formatted size and append the unit
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
export function isInJsonArray(data, targetBookUrl) {
  return data.some((item) => item.bookUrl === targetBookUrl);
}
export const readFileInChunks = async (
  fileUri,
  chunkSize = 5 * 1024 * 1024
) => {
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  const fileLength = fileInfo.size;
  let offset = 0;
  const chunks = [];

  while (offset < fileLength) {
    const chunk = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
      length: chunkSize,
      position: offset,
    });
    chunks.push(chunk);
    offset += chunkSize;
  }

  return chunks;
};

export const writeChunksToFile = async (fileUri, chunks) => {
  for (let i = 0; i < chunks.length; i++) {
    await FileSystem.StorageAccessFramework.writeAsStringAsync(
      fileUri,
      chunks[i],
      { encoding: FileSystem.EncodingType.Base64, append: i > 0 }
    );
  }
};
