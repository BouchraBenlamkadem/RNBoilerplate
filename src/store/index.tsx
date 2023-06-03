import { configureStore } from "@reduxjs/toolkit";
import { InfoSlice } from "slices";

export default configureStore({
  reducer: {
    info: InfoSlice.default.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false
    })
  ]
});
