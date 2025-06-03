import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { components } from "../../api/api-types";

type MemberInfo = components["schemas"]["MemberInfo"];

interface AuthState {
    isAuthenticated: boolean;
    memberInfo: MemberInfo | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    memberInfo: null,
    isLoading: false,
    error: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setMemberInfo: (state, action: PayloadAction<MemberInfo | null>) => {
            state.memberInfo = action.payload;
        },
        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setAuthError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearAuth: (state) => {
            state.isAuthenticated = false;
            state.memberInfo = null;
            state.error = null;
        },
        updateMemberInfo: (state, action: PayloadAction<Partial<MemberInfo>>) => {
            if (state.memberInfo) {
                state.memberInfo = { ...state.memberInfo, ...action.payload };
            }
        },
    },
});

export const {
    setAuthenticated,
    setMemberInfo,
    setAuthLoading,
    setAuthError,
    clearAuth,
    updateMemberInfo,
} = authSlice.actions;

export default authSlice.reducer;
