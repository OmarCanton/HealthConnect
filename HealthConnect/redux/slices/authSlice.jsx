import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null
};

const authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		registerUser: (state, action) => {
			state.user = action.payload
		},
		loginUser: (state, action) => {
			state.user = action.payload
		},
		logoutUser: (state) => {
			state.user = null
		},
	},
});

export const currentUser = (state) => state.auth.user

export const {
	registerUser,
	logoutUser,
	loginUser,
} = authSlice.actions;

export default authSlice.reducer;
