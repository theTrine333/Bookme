import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  library: [],
  currentBook: null,
  downloadedBooks: [],
  downloadedCount: 0, // Add this line to track the download count
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBookToLibrary: (state, action) => {
      state.library.push(action.payload);
    },
    setCurrentBook: (state, action) => {
      state.currentBook = action.payload;
    },
    addDownloadedBook: (state, action) => {
      state.downloadedBooks.push(action.payload);
      state.downloadedCount += 1; // Increment the download count
    },
    removeDownloadedBook: (state, action) => {
      state.downloadedBooks = state.downloadedBooks.filter(
        (book) => book.id !== action.payload
      );
    },
    resetDownloadCount: (state) => {
      state.downloadedCount = 0;
    },
  },
});

export const {
  addBookToLibrary,
  setCurrentBook,
  addDownloadedBook,
  removeDownloadedBook,
  resetDownloadCount,
} = booksSlice.actions;

export const booksReducer = booksSlice.reducer;
