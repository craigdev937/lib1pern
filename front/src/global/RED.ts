import { configureStore } from "@reduxjs/toolkit";
import { ThemeReducer } from "./ThemeSlice";

export const RED = configureStore({
    reducer: {
        theme: ThemeReducer
    }
});

export type RootState = ReturnType<typeof RED.getState>;
export type AppDispatch = typeof RED.dispatch;


