// BookDownloadContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import {
  extractLink,
  formattedSpeed,
  parseDownloadSize,
  sanitizeFileName,
} from "@/api/q";
import {
  BookDownloadContextType,
  DownloadRecord,
  Downloads,
  DownloadStatus,
} from "@/types";
import { getDownloads, insertDownload } from "@/api/db";

export interface SearchResult {
  poster: string;
  authors: string;
  download_server: string;
  publisher: string;
  title: string;
  book_url: string;
  year: string;
  lang: string;
  pages: string;
  download_size: string;
}

const BookDownloadContext = createContext<BookDownloadContextType | undefined>(
  undefined
);

export const useBookDownload = () => {
  const context = useContext(BookDownloadContext);
  if (!context) {
    throw new Error(
      "useBookDownload must be used within a BookDownloadProvider"
    );
  }
  return context;
};

export const BookDownloadProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const db = SQLite.useSQLiteContext();
  const [queue, setQueue] = useState<SearchResult[]>([]);
  const [currentBook, setCurrentBook] = useState<SearchResult | undefined>(
    undefined
  );
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState<number>(0);
  const [timeLeftCurrent, setTimeLeftCurrent] = useState(0);
  const [timeLeftTotal, setTimeLeftTotal] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadRecords, setDownloadRecords] = useState<Downloads[] | any>([]);
  const CacheDir = FileSystem.cacheDirectory;
  const lastBytesRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    fetchDownloadRecords();
  }, []);

  useEffect(() => {
    if (!isDownloading && queue.length > 0) {
      startNextDownload();
    }
  }, [queue, isDownloading]);

  const fetchDownloadRecords = async () => {
    try {
      const result = await getDownloads(db);
      setDownloadRecords(result);
    } catch (error) {}
  };

  const startNextDownload = async () => {
    const nextBook = queue[0];
    if (!nextBook) return;
    setCurrentBook(nextBook);
    setIsDownloading(true);
    setProgress(0);
    setSpeed(0);
    setTimeLeftCurrent(0);
    const link: string = await extractLink(nextBook.download_server);
    const downloadResumable = FileSystem.createDownloadResumable(
      link,
      FileSystem.cacheDirectory + sanitizeFileName(nextBook.title) + ".pdf",
      {},
      (downloadProgress) => {
        const { totalBytesWritten, totalBytesExpectedToWrite } =
          downloadProgress;

        const now = Date.now();
        const deltaTime = (now - lastTimeRef.current) / 1000;
        const deltaBytes = totalBytesWritten - lastBytesRef.current;

        if (deltaTime >= 1) {
          const currentSpeed = deltaBytes / deltaTime;
          setSpeed(Number(formattedSpeed(currentSpeed)));

          const remainingBytes = totalBytesExpectedToWrite - totalBytesWritten;
          const timeLeft = remainingBytes / currentSpeed;
          setTimeLeftCurrent(timeLeft);

          const totalRemaining = queue.reduce((sum, book, index) => {
            if (index === 0) {
              return sum + remainingBytes;
            }
            const sizeInBytes = parseDownloadSize(book.download_size);
            return sum + (sizeInBytes ?? 0);
          }, 0);

          setTimeLeftTotal(totalRemaining / currentSpeed);

          lastBytesRef.current = totalBytesWritten;
          lastTimeRef.current = now;
        }

        setProgress(totalBytesWritten / totalBytesExpectedToWrite);
      }
    );

    try {
      await downloadResumable.downloadAsync();
      insertDownload({
        db: db,
        fileUri: CacheDir + sanitizeFileName(nextBook.title) + ".pdf",
        authors: nextBook.authors,
        status: "COMPLETED",
        download_server: nextBook.download_server,
        title: nextBook.title,
        download_size: nextBook.download_size,
        lang: nextBook.lang,
        poster: nextBook.poster,
      });
      fetchDownloadRecords();
      finishCurrentDownload();
    } catch (error) {
      console.error("Download error:", error);
      insertDownload({
        db: db,
        fileUri: CacheDir + sanitizeFileName(nextBook.title) + ".pdf",
        authors: nextBook.authors,
        status: "ERROR",
        download_server: nextBook.download_server,
        title: nextBook.title,
        download_size: nextBook.download_size,
        lang: nextBook.lang,
        poster: nextBook.poster,
      });
      finishCurrentDownload();
    }
  };

  const finishCurrentDownload = () => {
    setQueue((prev) => prev.slice(1));
    setCurrentBook(undefined);
    setIsDownloading(false);
    setProgress(0);
    setSpeed(0);
    setTimeLeftCurrent(0);
    setTimeLeftTotal(0);
    lastBytesRef.current = 0;
    lastTimeRef.current = Date.now();
  };

  const addToQueue = (book: SearchResult) => {
    if (
      currentBook?.title === book.title ||
      queue.some((queuedFile) => queuedFile.title === book.title)
    ) {
      return;
    }
    setQueue((prevQueue) => [...prevQueue, book]);
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentBook(undefined);
    setIsDownloading(false);
    setProgress(0);
    setSpeed(0);
    setTimeLeftCurrent(0);
    setTimeLeftTotal(0);
  };

  const retryDownload = (record: DownloadRecord) => {
    const searchResult: SearchResult | any = {
      poster: record.Poster,
      authors: "",
      publisher: "",
      title: record.Title,
      download_server: record.Download_server,
      year: record.Year,
      lang: record.Lang,
      pages: record.Pages,
      download_size: "1MB", // approximate to allow estimation
    };
    setQueue((prev) => [...prev, searchResult]);
  };

  return (
    <BookDownloadContext.Provider
      value={{
        progress,
        speed,
        timeLeftCurrent,
        timeLeftTotal,
        currentBook,
        queue,
        isDownloading,
        addToQueue,
        clearQueue,
        retryDownload,
        downloadRecords,
        fetchDownloadRecords,
      }}
    >
      {children}
    </BookDownloadContext.Provider>
  );
};
