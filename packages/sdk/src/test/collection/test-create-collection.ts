import type { FlowContractAddress, FlowSdk } from "../../index"
import type { FlowFee } from "../../types/types"

export async function testCreateCollection(
	sdk: FlowSdk,
	collection?: FlowContractAddress,
	name: string = "TestCollection",
	symbol: string = "TST",
	royalties: FlowFee[] = [],
	icon?: string,
	description?: string,
	url?: string,
	supply?: number,
) {
	const createCollectionTx = await sdk.collection.createCollection({
		name,
		symbol,
		royalties,
		collection,
		icon,
		description,
		url,
		supply,
	})
	expect(createCollectionTx.collectionId).toBeGreaterThanOrEqual(0)
	return createCollectionTx
}
