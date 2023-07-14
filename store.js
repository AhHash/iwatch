import { configureStore } from "@reduxjs/toolkit";

import categoriesReducer from "./features/categories/categoriesSlice";
import commitmentsReducer from "./features/commitments/commitmentsSlice";

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    commitments: commitmentsReducer,
  },
});
