import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { THEME, ITheme } from "../models/interfaces";

const LoadTheme = () => {
    try {
        const stored = localStorage.getItem("theme");
        if ((stored) === "light" || (stored) === "dark") {
            return stored;
        };
        // Fall back to the OS preference.
        const prefersLight = window.matchMedia(
            "(prefers-color-schemd: light)"
        ).matches;
        return prefersLight ? "light" : "dark";
    } catch (error) {
        return "dark";
    }
};

//  Persist the choice and reflect it on the <html> element so the
//  CSS Variable in index.css can switch via [data-theme="..."].
const applyTheme = (mode: THEME) => {
    localStorage.setItem("theme", mode);
    document.documentElement.setAttribute("data-theme", mode);
};

//  Apply immediately so the first
//  paint matches the stored theme.
applyTheme(LoadTheme());

const initialState: ITheme = {
    mode: LoadTheme()
};

const ThemeSlice = createSlice({
    name: "theme",
    initialState: initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === "dark" ? "light" : "dark";
            applyTheme(state.mode);
        },
        setTheme: (state, action: PayloadAction<THEME>) => {
            state.mode = action.payload,
            applyTheme(state.mode)
        },
    }
});

export const { toggleTheme, setTheme } = ThemeSlice.actions;
export const ThemeReducer = ThemeSlice.reducer;



