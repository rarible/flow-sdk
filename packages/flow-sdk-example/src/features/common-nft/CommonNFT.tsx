import React from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { runBorrowNft, runCheck, runGetIds, runInit, runMint, selectNft } from "./slice"
import { selectAuth } from "../auth/authSlice"

export function CommonNFT() {
	const auth = useAppSelector(selectAuth)
	const nft = useAppSelector(selectNft)
	const dispatch = useAppDispatch()

	return (
		<div>
			<div>
				<button onClick={() => !auth.address || dispatch(runCheck(auth.address))}>
					CHECK
				</button>
				<span>{nft.check === undefined ? "unknown" : nft.check ? "true" : "false"}</span>
			</div>
			<div>
				<button onClick={() => !auth.address || dispatch(runGetIds(auth.address))}>
					GET_IDS
				</button>
				<span>{nft.getIds === undefined ? "unknown" : nft.getIds.map(it => `${it},`)}</span>
			</div>
			<div>
				<button onClick={() => !auth.address || dispatch(runBorrowNft({ address: auth.address, tokenId: 732 }))}>
					BORROW_NFT
				</button>
				<span>{nft.borrowNft === undefined ? "unknown" : JSON.stringify(nft.borrowNft)}</span>
			</div>
			<div>
				<button onClick={() => !auth.address || dispatch(runInit())}>
					INIT
				</button>
				<span>{nft.init}</span>
			</div>
			<div>
				<button onClick={() => !auth.address || dispatch(runMint())}>
					MINT
				</button>
				<span>{nft.mint}</span>
			</div>
		</div>
	)
}
