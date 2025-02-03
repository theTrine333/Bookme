import { configureStore } from "@reduxjs/toolkit";
import { booksReducer } from "./slicer.js";
// Create the Redux store
const store = configureStore({
  reducer: {
    books: booksReducer, // We'll create this later for book-related data
  },
});

export default store;
