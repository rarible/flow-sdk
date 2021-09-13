import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { borrowNft, burn, check, getIds, init, mint } from "./api"
import { RootState } from "../../app/store"


export interface CommonNFTState {
	check?: boolean
	getIds?: number[]
	borrowNft?: any
	init?: any
	mint?: any
}

const initialState: CommonNFTState = {}

export const runCheck = createAsyncThunk("common-nft/check", check)
export const runGetIds = createAsyncThunk("common-nft/get_ids", getIds)
export const runBorrowNft = createAsyncThunk(
	"common-nft/borrow_nft",
	async (arg: { address: string, tokenId: number }, x) =>
		borrowNft(arg.address, arg.tokenId),
)

export const runInit = createAsyncThunk("common-nft/init", init)
export const runMint = createAsyncThunk("common-nft/mint", mint)
export const runBurn = createAsyncThunk("common-nft/burn", burn)

export const slice = createSlice({
	name: "nft",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(runCheck.fulfilled, ((state, action) => {
				state.check = action.payload
			}))
			.addCase(runGetIds.fulfilled, ((state, action) => {
				state.getIds = action.payload
			}))
			.addCase(runBorrowNft.fulfilled, ((state, action) => {
				state.borrowNft = action.payload
			}))
			.addCase(runInit.fulfilled, ((state, action) => {
				state.init = action.payload
			}))
			.addCase(runMint.fulfilled, ((state, action) => {
				state.mint = action.payload
			}))
	},
})

export const selectNft = (state: RootState) => state.nft

export default slice.reducer
