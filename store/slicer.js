import { createSlice } from "@reduxjs/toolkit";

const deletesSlicer = createSlice({
  name: "deletes",
  initialState: {
    books: [],
    exports: [],
  },
  reducers: {
    addToBeDeleted: (state, action) => {
      const { Poster, bookTitle, bookUrl, Server } = action.payload;
      state.books.push({
        Poster: Poster,
        bookTitle: bookTitle,
        bookUrl: bookUrl,
        Server: Server,
      });
    },
    removeFromToBeDeleted: (state, action) => {
      const { bookUrl, Server } = action.payload;
      state.books = state.books.filter(
        (item) => !(item.Server === Server && item.bookUrl === bookUrl)
      );
    },
    clearToBeDeleted: (state, action) => {
      state.books = [];
    },
    addToBeExported: (state, action) => {
      const { Poster, bookTitle, bookUrl, Server } = action.payload;
      state.exports.push({
        Poster: Poster,
        bookTitle: bookTitle,
        bookUrl: bookUrl,
        Server: Server,
      });
    },
    removeFromToBeExported: (payload, action) => {
      const { bookUrl, Server } = action.payload;
      state.exports = state.exports.filter(
        (item) => !(item.Server === Server && item.bookUrl === bookUrl)
      );
    },
  },
});

export const {
  addToBeDeleted,
  removeFromToBeDeleted,
  clearToBeDeleted,
  addToBeExported,
} = deletesSlicer.actions;
export const booksReducer = deletesSlicer.reducer;
