import type { FlowMintResponse } from "../nft/mint"
import type { FlowContractAddress, FlowFee, FlowSdk } from "../../index"

export async function mintTest(
	sdk: FlowSdk,
	collection: FlowContractAddress,
	royalties: FlowFee[] = [],
): Promise<FlowMintResponse> {
	const mintTx = await sdk.nft.mint(
		collection,
		"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
		royalties,
	)
	expect(mintTx.status).toEqual(4)
	expect(parseInt(mintTx.tokenId.split(":")[1])).toBeGreaterThanOrEqual(0)
	return mintTx
}
