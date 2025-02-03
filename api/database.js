import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const exportDatabase = async () => {
  try {
    const dbName = "bookme.db";
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
    if (!fileInfo.exists) {
      console.error("Database does not exist.");
      return;
    }

    // Ask the user to select a directory
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!permissions.granted) {
      console.log("User denied directory access.");
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
    console.error("Error exporting database:", error);
  }
};
