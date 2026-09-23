import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { ThemeReducer } from "./ThemeSlice";
import { BookAPI } from "./BookAPI";
import { AuthAPI } from "./AuthAPI";

export const RED = configureStore({
    reducer: {
        theme: ThemeReducer,
        [BookAPI.reducerPath]: BookAPI.reducer,
        [AuthAPI.reducerPath]: AuthAPI.reducer,
    },   //   gDM = getDefaultMiddleware.
    middleware: (gDM) => gDM().concat(BookAPI.middleware),
});

setupListeners(RED.dispatch);
export type RootState = ReturnType<typeof RED.getState>;
export type AppDispatch = typeof RED.dispatch;



