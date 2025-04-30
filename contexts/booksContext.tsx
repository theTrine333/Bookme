import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { sanitizeFileName } from "@/api/q";
import { deleteDownload } from "@/api/db";
import { useSQLiteContext } from "expo-sqlite";
import { useBookDownload } from "./downloadContext";
import { Toast } from "toastify-react-native";
type BookProgressContextType = {
  getPage: (bookName: string) => number;
  savePage: (bookName: string, page: number) => void;
  deleting: boolean;
  selectedBooks: string[];
  toggleBookSelection: (bookName: string) => void;
  clearSelection: () => void;
  deleteSelectedBooks: () => void;
};

const STORAGE_KEY = "book_progress";

const BookProgressContext = createContext<BookProgressContextType | undefined>(
  undefined
);

export const BookProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const db = useSQLiteContext();
  const downloadContext = useBookDownload();
  const [deleting, setDeleting] = useState<boolean>(false);
  // Load saved progress on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setProgress(JSON.parse(data));
    });
  }, []);

  const saveProgressToStorage = (data: Record<string, number>) => {
    setProgress(data);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const savePage = (bookName: string, page: number) => {
    const updated = { ...progress, [bookName]: page };
    saveProgressToStorage(updated);
  };

  const getPage = (bookName: string): number => {
    return progress[bookName] ?? 0;
  };

  const toggleBookSelection = (bookName: string) => {
    setSelectedBooks((prev) =>
      prev.includes(bookName)
        ? prev.filter((b) => b !== bookName)
        : [...prev, bookName]
    );
  };

  const clearSelection = () => {
    setSelectedBooks([]);
  };

  const deleteSelectedBooks = () => {
    const updated = { ...progress };
    setDeleting(true);
    selectedBooks.forEach(async (book) => {
      try {
        let fileLocation =
          FileSystem.cacheDirectory + sanitizeFileName(book) + ".pdf";
        await FileSystem.deleteAsync(fileLocation);
        await deleteDownload(db, fileLocation);
        downloadContext.fetchDownloadRecords();
        Toast.success("Books were deleted succesfully");
      } catch (error) {
        console.log("Something happended : ", error);
      }
    });
    setSelectedBooks([]);
    setDeleting(false);
  };

  return (
    <BookProgressContext.Provider
      value={{
        getPage,
        savePage,
        selectedBooks,
        toggleBookSelection,
        clearSelection,
        deleteSelectedBooks,
        deleting,
      }}
    >
      {children}
    </BookProgressContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookProgressContext);
  if (!context)
    throw new Error("useBookProgress must be used within BookProgressProvider");
  return context;
};
