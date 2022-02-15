import { FLOW_ZERO_ADDRESS, toBigNumber } from "@rarible/types"
import type { FlowRoyalty } from "@rarible/flow-api-client"
import type { FlowContractAddress, FlowSdk } from "../../index"
import { checkEvent } from "../check-event"
import type { FlowMintResponse } from "../../interfaces/nft/mint"

export async function mintRaribleNftTest(
	sdk: FlowSdk, collection: FlowContractAddress, royalties: FlowRoyalty[] = [],
): Promise<FlowMintResponse> {
	const r = royalties.length ? royalties : [{ account: FLOW_ZERO_ADDRESS, value: toBigNumber("0.1") }]
	const mint = await sdk.nft.mint(
		collection,
		"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
		r,
	)
	checkEvent(mint, "Mint", "RaribleNFT")
	expect(mint.status).toEqual(4)
	return mint
}
