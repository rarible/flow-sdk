import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as fcl from "@onflow/fcl"
import { RootState } from "../../app/store"

export interface AuthState {
	address?: string,
	loggedIn: boolean,
	status: "idle" | "loading"
}

const initialState: AuthState = { loggedIn: false, status: "idle" }

export const login = createAsyncThunk("auth/login", fcl.logIn)
export const signup = createAsyncThunk("auth/signup", fcl.signUp)
export const logout = createAsyncThunk("auth/logout", fcl.unauthenticate)

export const authSlice = createSlice({
		name: "auth",
		initialState,
		reducers: {
			update: (state, action) => {
				state.status = "idle"
				state.address = action.payload.address
				state.loggedIn = !!action.payload.loggedIn
			},
		},
		extraReducers: (builder) => {
			builder
				.addCase(
					login.pending,
					state => {
						state.status = "loading"
					})
				.addCase(
					signup.pending,
					state => {
						state.status = "loading"
					})
				.addCase(
					logout.pending,
					state => {
						state.status = "loading"
					})
		},
	},
)

export const { update } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth

export default authSlice.reducer
