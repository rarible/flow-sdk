import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"
import authReducer, { update } from "../features/auth/authSlice"
import nftReducer from "../features/common-nft/slice"
import * as fcl from "@onflow/fcl"

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		auth: authReducer,
		nft: nftReducer,
	},
})

// todo: figure out where to put it
fcl.currentUser().subscribe((data: any) => {
	store.dispatch(update({ state: "idle", address: data.addr, loggedIn: data.loggedIn }))
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
	RootState,
	unknown,
	Action<string>>;
