import { configureStore } from "@reduxjs/toolkit";
import AccountSettigsSlice from "../SliceReducers/AppGlobalData/AppGlobalDataSlice";

export const store = configureStore({
    reducer: {
        AccountsSettings: AccountSettigsSlice
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {counter: counterState}
export type AppDispatch = typeof store.dispatch;
