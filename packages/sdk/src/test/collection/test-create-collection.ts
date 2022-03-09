import type { FlowContractAddress, FlowSdk } from "../../index"
import type { FlowFee } from "../../types"

export async function testCreateCollection(
	sdk: FlowSdk,
	parentCollection?: FlowContractAddress,
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
		parentCollection,
		icon,
		description,
		url,
		supply,
	})
	const [, collectionIdNumber] = createCollectionTx.collectionId.split(":")
	expect(parseInt(collectionIdNumber)).toBeGreaterThanOrEqual(0)
	return createCollectionTx
}
