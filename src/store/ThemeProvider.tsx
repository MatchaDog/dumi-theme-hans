/*
 * @Date: 2020-09-29 18:11:16
 * @LastEditors: Hans
 * @description:
 * @LastEditTime: 2020-09-29 18:13:42
 * @FilePath: /dumi-theme-hans/src/store/ThemeProvider.tsx
 */
import React, { useReducer, createContext, FC } from "react";

const ThemeStore = createContext({
    state: null,
    dispatch: null,
});

const reducer = (
    state: any,
    action: {
        type?: string;
        value: any;
    },
) => {
    return {
        ...state,
        ...action.value,
    };
};

const initialState: any = {
    theme: "default",
};

const ThemeProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <ThemeStore.Provider
            value={{
                state,
                dispatch,
            }}>
            {children}
        </ThemeStore.Provider>
    );
};

export { ThemeProvider, ThemeStore };
