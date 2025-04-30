import { Downloads, downloadsDbPropms, Searches } from "@/types";
import { SQLiteDatabase } from "expo-sqlite"; // if you're using expo-sqlite
import { sanitizeFileName } from "./q";

export const getDownloads = async (db: SQLiteDatabase): Promise<Searches[]> => {
  const results: Searches[] = await db.getAllAsync<Searches>(
    "SELECT Authors,Download_server, FileUri,Download_size,Lang,Title,Poster FROM Downloads ORDER BY id DESC"
  );
  return results;
};

export const deleteDownload = async (db: SQLiteDatabase, location: string) => {
  try {
    await db.runAsync("DELETE FROM Downloads where FileUri is ?", location);
  } catch (error) {}
};
export const getBookmarks = async (db: SQLiteDatabase): Promise<any[]> => {
  const results = await db.getAllAsync<Downloads[]>("SELECT * FROM Bookmarks");
  return results;
};

export const getFavourites = async (db: SQLiteDatabase): Promise<any[]> => {
  const results = await db.getAllAsync<Downloads[]>("SELECT * FROM Favourites");
  return results;
};

export const getReads = async (db: SQLiteDatabase): Promise<any[]> => {
  const results = await db.getAllAsync("SELECT * FROM Reads");
  return results;
};

export const insertDownload = async ({
  db,
  title,
  authors,
  download_size,
  lang,
  poster,
  download_server,
  fileUri,
  status,
}: downloadsDbPropms) => {
  try {
    const res = await db.runAsync(
      "INSERT INTO Downloads (Title,Authors,Poster,Lang,Download_size,FileUri,Download_server,Status) VALUES (?,?,?,?,?,?,?,?)",
      [
        sanitizeFileName(title),
        authors,
        poster,
        lang,
        download_size,
        fileUri,
        download_server,
        status,
      ]
    );
  } catch (error) {
    console.log("Error recording file : ", error);
  }
};

export const updateDownloadStatus = async ({
  db,
  title,
  status,
}: downloadsDbPropms) => {
  await db.runAsync("UPDATE Downloads SET Status=? WHERE Title=?", [
    status,
    sanitizeFileName(title),
  ]);
};
