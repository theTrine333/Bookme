import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearToBeDeleted } from "../store/slicer";

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
  const permissions =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permissions.granted) {
    // Alert.alert("Error", "User didn't grant storage permissions");
    dispatch(clearToBeDeleted());
    return;
  }

  // Get the URI of the selected directory
  const directoryUri = permissions.directoryUri;

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
  ToastAndroid.showWithGravityAndOffset(
    "Your files were exported successfully!",
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50
  );
  dispatch(clearToBeDeleted());
};

function extractFileNameFromUrl(url) {
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
export function isInJsonArray(data, targetBookUrl) {
  return data.some((item) => item.bookUrl === targetBookUrl);
}
