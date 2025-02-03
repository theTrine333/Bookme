import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";

const exportDatabase = async () => {
  try {
    const dbName = "bookme.db";
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

    // Check if the database file exists
    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
    if (!fileInfo.exists) {
      console.error("Database does not exist.");
      return;
    }

    // Ask the user to pick a location to store the exported database
    const pickerResult = await DocumentPicker.getDocumentAsync({
      type: "*/*", // Allow all file types
      copyToCacheDirectory: false, // Let the user pick a directory
    });

    if (pickerResult.type === "cancel") {
      console.log("User cancelled the file picker");
      return;
    }

    // Get the destination file path
    const exportPath = pickerResult.uri; // This is the selected path where the user wants to save the file

    // Copy the database file to the selected destination
    await FileSystem.copyAsync({
      from: dbFilePath,
      to: exportPath,
    });

    console.log("Database exported successfully to:", exportPath);

    // Optionally, use expo-sharing to allow the user to share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(exportPath); // This will open the system's sharing interface
    }
  } catch (error) {
    console.error("Error exporting database:", error);
  }
};
