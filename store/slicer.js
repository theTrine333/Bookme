import { createSlice } from "@reduxjs/toolkit";

const deletesSlicer = createSlice({
  name: "deletes",
  initialState: {
    books: [],
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
  },
});

export const { addToBeDeleted, removeFromToBeDeleted, clearToBeDeleted } =
  deletesSlicer.actions;
export const booksReducer = deletesSlicer.reducer;
