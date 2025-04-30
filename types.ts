import { SQLiteDatabase } from "expo-sqlite";
import { ViewStyle } from "react-native";
import { Router, useRouter } from "expo-router";
export interface SearchResult {
  poster: string;
  authors: string;
  setModalVisibility?: any;
  publisher: string;
  title: string;
  book_url: string;
  year: string;
  lang: string;
  download_server: string;
  pages: string;
  download_size: string;
  setModalData?: any;
}

export interface Searches {
  poster: string;
  authors: string;
  title: string;
  lang: string;
  fileUri: string;
  download_server: string;
  pages: string;
  download_size: string;
}

export interface ModalProps {
  setModalVisibility?: any;
  modalData?: any;
}

export type detailsParamsProps = {
  __EXPO_ROUTER_key: string;
  authors: string;
  book_url: string;
  desc: string;
  download_server: string;
  download_size: string;
  lang: string;
  pages: string;
  poster: string;
  title: string;
  year: string;
};

export interface handlerParamas {
  __EXPO_ROUTER_key?: string;
  name?: string;
  url?: string;
}

export type readerParamsProps = {
  __EXPO_ROUTER_key?: string;
  authors: string;
  book_url: string;
  download_server: string;
  download_size: string;
  lang: string;
  pages: string;
  poster: string;
  title: string;
  year: string;
};

export interface HeaderElement {
  title?: string;
  rightIcon?: any;
  rightIconAction?: any;
  leftIcon?: any;
  leftIconAction?: any;
}

export interface CustomTextInputProp {
  submitFunction?: any;
  loadFunction?: any;
  isEmail?: boolean;
  isPassField?: boolean;
  isBio?: boolean;
  isSearch?: boolean;
  setter: any;
  placeholderText: string;
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad"
    | "url";
  style?: ViewStyle;
}

export type DownloadStatus = "PENDING" | "COMPLETED" | "ERROR";

export interface DownloadRecord {
  db: SQLiteDatabase;
  Authors: string;
  FileUri: string;
  Download_server: string;
  Download_size: string;
  Lang: string;
  Pages: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface Downloads {
  Authors: string;
  FileUri: string;
  Download_server: string;
  Download_size: string;
  Lang: string;
  Pages: string;
  Title: string;
  Year: string;
  Poster?: string;
}

export interface DownloadCardProps extends Downloads {
  router: Router;
}

export interface downloadsDbPropms {
  db: SQLiteDatabase;
  title: string;
  authors: string;
  poster: string;
  lang: string;
  download_size: string;
  fileUri: string;
  download_server: string;
  status: DownloadStatus;
}

export interface DownloadInfo {
  progress: number;
  speed: number;
  timeLeftCurrent: number;
  timeLeftTotal: number;
  currentBook?: SearchResult;
  queue: SearchResult[];
  isDownloading: boolean;
  downloadRecords: DownloadRecord[];
}

export interface BookDownloadContextType extends DownloadInfo {
  addToQueue: (book: SearchResult) => void;
  clearQueue: () => void;
  retryDownload: (record: DownloadRecord) => void;
  fetchDownloadRecords: () => void;
}
