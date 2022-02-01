import type { FlowAddress } from "@rarible/types"
import type { FlowContractAddress, FlowSdk } from "../../index"
import type { FlowFee } from "../../types"

export async function testCreateCollection(
	sdk: FlowSdk,
	receiver: FlowAddress,
	collection?: FlowContractAddress,
	name: string = "TestCollection",
	symbol: string = "TST",
	royalties: FlowFee[] = [],
	icon?: string,
	description?: string,
	url?: string,
	supply?: number,
) {
	const mintTx = await sdk.collection.createCollection({
		name,
		symbol,
		royalties,
		receiver,
		collection,
		icon,
		description,
		url,
		supply,
	})
	expect(mintTx.collectionId).toBeGreaterThanOrEqual(0)
	return mintTx
}
